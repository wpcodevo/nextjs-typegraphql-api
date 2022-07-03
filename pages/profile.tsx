import type { GetServerSideProps, NextPage } from 'next';
import { dehydrate } from 'react-query';
import Header from '../client/components/Header';
import {
  GetMeDocument,
  GetMeQuery,
  useGetMeQuery,
} from '../client/generated/graphql';
import { IUser } from '../client/lib/types';
import { REFRESH_ACCESS_TOKEN } from '../client/middleware/AuthMiddleware';
import { axiosGetMe } from '../client/requests/axiosClient';
import graphqlRequestClient, {
  queryClient,
} from '../client/requests/graphqlRequestClient';
import useStore from '../client/store';

type ProfileProps = {};

const ProfilePage: NextPage<ProfileProps> = ({}) => {
  const store = useStore();

  const user = store.authUser;
  const query = useGetMeQuery<GetMeQuery, Error>(
    graphqlRequestClient,
    {},
    {
      retry: 1,
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

  return (
    <>
      <Header />
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies.access_token) {
    await queryClient.prefetchQuery(['getMe', {}], () =>
      axiosGetMe(GetMeDocument, req.cookies.access_token as string)
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
      requireAuth: true,
      enableAuth: true,
    },
  };
};

export default ProfilePage;
