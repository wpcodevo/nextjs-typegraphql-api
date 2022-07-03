import { GraphQLClient } from 'graphql-request';
import { QueryClient } from 'react-query';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string;

const graphqlRequestClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: 'include',
  mode: 'cors',
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
  },
});

export default graphqlRequestClient;
