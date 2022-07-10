import { AuthenticationError, ForbiddenError } from 'apollo-server-micro';
import { setCookies } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import errorHandler from '../controllers/error.controller';
import deserializeUser from '../middleware/deserializeUser';
import { LoginInput } from '../schemas/user.schema';
import UserModel, { User } from '../models/user.model';
import { Context } from '../types/context';
import { disconnectDB } from '../utils/connectDB';
import redisClient from '../utils/connectRedis';
import { signJwt, verifyJwt } from '../utils/jwt';

const accessTokenExpiresIn = 15;
const refreshTokenExpiresIn = 60;

const cookieOptions: OptionsType = {
  httpOnly: true,
  // domain: '/',
  sameSite: 'lax',
  // secure: true,
};

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

const accessTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + accessTokenExpiresIn * 60 * 1000),
  maxAge: accessTokenExpiresIn * 60,
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + refreshTokenExpiresIn * 60 * 1000),
  maxAge: refreshTokenExpiresIn * 60,
};

async function findByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email }).select('+password');
}

function signTokens(user: User) {
  const userId: string = user._id.toString();
  const access_token = signJwt({ userId }, 'accessTokenPrivateKey', {
    expiresIn: `${accessTokenExpiresIn}m`,
  });

  const refresh_token = signJwt({ userId }, 'refreshTokenPrivateKey', {
    expiresIn: `${refreshTokenExpiresIn}m`,
  });

  redisClient.set(userId, JSON.stringify(user), {
    EX: refreshTokenExpiresIn * 60,
  });

  return { access_token, refresh_token };
}

export default class UserService {
  async signUpUser(input: Partial<User>) {
    try {
      const user = await UserModel.create(input);
      await disconnectDB();
      return {
        status: 'success',
        user: {
          ...user.toJSON(),
          id: user?._id,
        },
      };
    } catch (error: any) {
      if (error.code === 11000) {
        return new ForbiddenError('Email already exists');
      }
      errorHandler(error);
    }
  }

  async loginUser(input: LoginInput, { req, res }: Context) {
    try {
      const message = 'Invalid email or password';
      // 1. Find user by email
      const user = await findByEmail(input.email);
      await disconnectDB();

      if (!user) {
        return new AuthenticationError(message);
      }

      // 2. Compare passwords
      if (!(await UserModel.comparePasswords(user.password, input.password))) {
        return new AuthenticationError(message);
      }

      // 3. Sign JWT Tokens
      const { access_token, refresh_token } = signTokens(user);

      // 4. Add Tokens to Context
      setCookies('access_token', access_token, {
        req,
        res,
        ...accessTokenCookieOptions,
      });
      setCookies('refresh_token', refresh_token, {
        req,
        res,
        ...refreshTokenCookieOptions,
      });
      setCookies('logged_in', 'true', {
        req,
        res,
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      return {
        status: 'success',
        access_token,
      };
    } catch (error: any) {
      errorHandler(error);
    }
  }

  async getMe({ req, res, deserializeUser }: Context) {
    try {
      const user = await deserializeUser(req, res);
      return {
        status: 'success',
        user: {
          ...user,
          id: user?._id,
        },
      };
    } catch (error: any) {
      errorHandler(error);
    }
  }

  async refreshAccessToken({ req, res }: Context) {
    try {
      // Get the refresh token
      const { refresh_token } = req.cookies;

      if (!refresh_token) {
        throw new ForbiddenError('Could not refresh access token');
      }

      // Validate the RefreshToken
      const decoded = verifyJwt<{ userId: string }>(
        refresh_token,
        'refreshTokenPublicKey'
      );

      if (!decoded) {
        throw new ForbiddenError('Could not refresh access token');
      }

      // Check if user's session is valid
      const session = await redisClient.get(decoded.userId);

      if (!session) {
        throw new ForbiddenError('User session has expired');
      }

      // Check if user exist and is verified
      const user = await UserModel.findById(JSON.parse(session)._id).select(
        '+verified'
      );
      await disconnectDB();

      if (!user || !user.verified) {
        throw new ForbiddenError('Could not refresh access token');
      }

      // Sign new access token
      const access_token = signJwt(
        { userId: user._id },
        'accessTokenPrivateKey',
        {
          expiresIn: `${accessTokenExpiresIn}m`,
        }
      );

      // Send access token cookie
      setCookies('access_token', access_token, {
        req,
        res,
        ...accessTokenCookieOptions,
      });
      setCookies('logged_in', 'true', {
        req,
        res,
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      return {
        status: 'success',
        access_token,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async logoutUser({ req, res }: Context) {
    try {
      const user = await deserializeUser(req, res);

      // Delete the user's session
      await redisClient.del(String(user?._id));

      // Logout user
      setCookies('access_token', '', { req, res, maxAge: -1 });
      setCookies('refresh_token', '', { req, res, maxAge: -1 });
      setCookies('logged_in', '', { req, res, maxAge: -1 });

      return true;
    } catch (error) {
      errorHandler(error);
    }
  }
}
