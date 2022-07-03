import axios from 'axios';
import { GetMeQuery } from '../generated/graphql';
const BASE_URL = 'http://localhost:3000/api/graphql';

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosGetMe = async (data: string, access_token: string) => {
  const response = await authApi.post<GetMeQuery>(
    '',
    { query: data },
    {
      headers: {
        cookie: `access_token=${access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
