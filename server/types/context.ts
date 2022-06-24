import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../models/user.model';

export type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  deserializeUser: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<User | undefined>;
};
