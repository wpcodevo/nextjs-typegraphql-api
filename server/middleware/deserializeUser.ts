import { AuthenticationError, ForbiddenError } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkCookies, getCookie } from 'cookies-next';
import errorHandler from '../controllers/error.controller';
import UserModel from '../models/user.model';
import redisClient from '../utils/connectRedis';
import { verifyJwt } from '../utils/jwt';
import { disconnectDB } from '../utils/connectDB';

const deserializeUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Get the access token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (checkCookies('access_token', { req, res })) {
      access_token = getCookie('access_token', { req, res });
    }

    if (!access_token) throw new AuthenticationError('No access token found');

    // Validate the Access token
    const decoded = verifyJwt<{ userId: string }>(
      String(access_token),
      'accessTokenPublicKey'
    );

    if (!decoded) throw new AuthenticationError('Invalid access token');

    // Check if the session is valid
    const session = await redisClient.get(decoded.userId);

    if (!session) throw new ForbiddenError('Session has expired');

    // Check if user exist
    const user = await UserModel.findById(JSON.parse(session)._id)
      .select('+verified')
      .lean(true);
    await disconnectDB();

    if (!user || !user.verified) {
      throw new ForbiddenError(
        'The user belonging to this token no logger exist'
      );
    }

    return user;
  } catch (error: any) {
    errorHandler(error);
  }
};

export default deserializeUser;
