import React, { useEffect } from 'react';
import {
  useGetMeQuery,
  useRefreshAccessTokenQuery,
} from '../generated/graphql';
import { IUser } from '../lib/types';
import graphqlRequestClient, {
  queryClient,
} from '../requests/graphqlRequestClient';
import useStore from '../store';

type AuthMiddlewareProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  enableAuth?: boolean;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({
  children,
  requireAuth,
  enableAuth,
}) => {
  console.log('I was called from AuthMiddleware');
  const store = useStore();
  const query = useRefreshAccessTokenQuery(
    graphqlRequestClient,
    {},
    {
      enabled: false,
      retry: 1,
      onError(error: any) {
        store.setPageLoading(false);
        document.location.href = '/login';
      },
      onSuccess(data: any) {
        store.setPageLoading(false);
        queryClient.refetchQueries('getMe');
      },
    }
  );
  const { isLoading, isFetching } = useGetMeQuery(
    graphqlRequestClient,
    {},
    {
      onSuccess: (data) => {
        store.setPageLoading(false);
        store.setAuthUser(data.getMe.user as IUser);
      },
      retry: 1,
      enabled: !!enableAuth,
      onError(error: any) {
        store.setPageLoading(false);
        error.response.errors.forEach((err: any) => {
          if (err.message.includes('No access token found')) {
            query.refetch({ throwOnError: true });
          }
        });
      },
    }
  );

  const loading =
    isLoading || isFetching || query.isLoading || query.isFetching;

  useEffect(() => {
    if (loading) {
      store.setPageLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return <>{children}</>;
};

export default AuthMiddleware;
