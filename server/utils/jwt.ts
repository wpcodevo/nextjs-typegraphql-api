import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (
  payload: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: SignOptions
) => {
  const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
  const refreshTokenPrivateKey = process.env
    .REFRESH_TOKEN_PRIVATE_KEY as string;
  let privateKey = '';
  if (keyName === 'accessTokenPrivateKey') {
    privateKey = Buffer.from(accessTokenPrivateKey, 'base64').toString('ascii');
  } else if (keyName === 'refreshTokenPrivateKey') {
    privateKey = Buffer.from(refreshTokenPrivateKey, 'base64').toString(
      'ascii'
    );
  }

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
  let publicKey = '';
  const accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY as string;
  const refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY as string;
  if (keyName === 'accessTokenPublicKey') {
    publicKey = Buffer.from(accessTokenPublicKey, 'base64').toString('ascii');
  } else if (keyName === 'refreshTokenPublicKey') {
    publicKey = Buffer.from(refreshTokenPublicKey, 'base64').toString('ascii');
  }

  try {
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};
