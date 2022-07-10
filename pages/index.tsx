import type { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { dehydrate } from 'react-query';
import { toast } from 'react-toastify';
import Header from '../client/components/Header';
import Message from '../client/components/Message';
import PostItem from '../client/components/posts/post.component';
import {
  GetMeDocument,
  useGetAllPostsQuery,
} from '../client/generated/graphql';
import { axiosGetMe } from '../client/requests/axiosClient';
import graphqlRequestClient, {
  queryClient,
} from '../client/requests/graphqlRequestClient';
import useStore from '../client/store';

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

const HomePage: NextPage = () => {
  const store = useStore();
  const { data: posts, isLoading } = useGetAllPostsQuery(
    graphqlRequestClient,
    {
      input: { limit: 10, page: 1 },
    },
    {
      select: (data) => data.getPosts.posts,
      onError(error: any) {
        store.setPageLoading(false);
        error.response.errors.forEach((err: any) => {
          toast(err.message, {
            type: 'error',
            position: 'top-right',
          });
        });
      },
    }
  );

  useEffect(() => {
    if (isLoading) {
      store.setPageLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return (
    <>
      <Header />
      <section className='bg-ct-blue-600 min-h-screen py-12'>
        <div>
          {posts?.length === 0 ? (
            <Message>There are no posts at the moment</Message>
          ) : (
            <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 px-6'>
              {posts?.map((post) => (
                <PostItem key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
