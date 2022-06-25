import type { GetServerSideProps, NextPage } from 'next';
import { dehydrate } from 'react-query';
import { useStateContext } from '../client/context';
import { IUser } from '../client/context/types';
import {
  GetMeDocument,
  GetMeQuery,
  useGetMeQuery,
} from '../client/generated/graphql';
import { REFRESH_ACCESS_TOKEN } from '../client/middleware/AuthMiddleware';
import graphqlRequestClient, {
  queryClient,
} from '../client/requests/graphqlRequestClient';

type HomeProps = {};

const Home: NextPage<HomeProps> = () => {
  const stateContext = useStateContext();

  const user = stateContext.state.authUser;

  const query = useGetMeQuery<GetMeQuery, Error>(
    graphqlRequestClient,
    {},
    {
      retry: 1,
      onSuccess: (data) => {
        stateContext.dispatch({
          type: 'SET_USER',
          payload: data.getMe.user as IUser,
        });
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

  return (
    <section className='bg-ct-blue-600 min-h-screen pt-20'>
      <div className='max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center'>
        <div>
          <p className='text-5xl font-semibold'>Profile Page</p>
          <div className='mt-8'>
            <p className='mb-4'>ID: {user?.id}</p>
            <p className='mb-4'>Name: {user?.name}</p>
            <p className='mb-4'>Email: {user?.email}</p>
            <p className='mb-4'>Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies.access_token) {
    await queryClient.prefetchQuery('getMe', () =>
      graphqlRequestClient.request(
        GetMeDocument,
        {},
        {
          Authorization: `Bearer ${req.cookies.access_token}`,
        }
      )
    );
  } else {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
