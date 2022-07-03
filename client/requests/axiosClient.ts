import axios from 'axios';
import { GetMeQuery, RefreshAccessTokenQuery } from '../generated/graphql';
const BASE_URL = 'http://localhost:3000/api/graphql';

type IRefreshResponse = {
  status: string;
  access_token: string;
};

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosRefreshAccessToken = async (
  data: string,
  refresh_token: string
) => {
  const response = await authApi.post<RefreshAccessTokenQuery>(
    '',
    { query: data },
    {
      headers: {
        cookie: `refresh_token=${refresh_token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(response.data);
  return response.data;
};

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
