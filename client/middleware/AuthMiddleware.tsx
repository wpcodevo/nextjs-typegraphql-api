import { useCookies } from 'react-cookie';
import FullScreenLoader from '../components/FullScreenLoader';
import React from 'react';
import { GetMeQuery, useGetMeQuery } from '../generated/graphql';
import { gql } from 'graphql-request';
import graphqlRequestClient from '../requests/graphqlRequestClient';
import useStore from '../store';
import { IUser } from '../lib/types';

export const REFRESH_ACCESS_TOKEN = gql`
  query {
    refreshAccessToken {
      status
      access_token
    }
  }
`;

type AuthMiddlewareProps = {
  children: React.ReactElement;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [cookies] = useCookies(['logged_in']);
  const store = useStore();

  const query = useGetMeQuery<GetMeQuery, Error>(
    graphqlRequestClient,
    {},
    {
      retry: 1,
      enabled: Boolean(cookies.logged_in),
      onSuccess: (data) => {
        store.setAuthUser(data.getMe.user as IUser);
      },
      onError(error: any) {
        error.response.errors.forEach(async (err: any) => {
          if (err.message.includes('not logged in')) {
            try {
              await graphqlRequestClient.request(REFRESH_ACCESS_TOKEN);
              query.refetch();
            } catch (error) {
              document.location.href = '/login';
            }
          }
        });
      },
    }
  );

  if (query.isLoading) {
    return <FullScreenLoader />;
  }

  return children;
};

export default AuthMiddleware;
