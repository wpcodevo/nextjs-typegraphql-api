import type { GetServerSideProps, NextPage } from 'next';
import { object, string, TypeOf } from 'zod';
import { useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../client/components/FormInput';
import { LoadingButton } from '../client/components/LoadingButton';
import Link from 'next/link';
import {
  LoginUserMutation,
  useGetMeQuery,
  useLoginUserMutation,
} from '../client/generated/graphql';
import graphqlRequestClient from '../client/requests/graphqlRequestClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useStore from '../client/store';
import { IUser } from '../client/lib/types';

const loginSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage: NextPage = () => {
  const router = useRouter();
  const store = useStore();

  const query = useGetMeQuery(
    graphqlRequestClient,
    {},
    {
      enabled: false,
      onSuccess: (data) => {
        store.setAuthUser(data.getMe.user as IUser);
      },
    }
  );

  const { isLoading, mutate: loginUser } = useLoginUserMutation<Error>(
    graphqlRequestClient,
    {
      onSuccess(data: LoginUserMutation) {
        toast('Logged in successfully', {
          type: 'success',
          position: 'top-right',
        });
        query.refetch();
        router.push('/');
      },
      onError(error: any) {
        error.response.errors.forEach((err: any) => {
          toast(err.message, {
            type: 'error',
            position: 'top-right',
          });
        });
      },
    }
  );

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    // 👇 Executing the loginUser Mutation
    loginUser({ input: values });
  };
  return (
    <section className='bg-ct-blue-600 min-h-screen grid place-items-center'>
      <div className='w-full'>
        <h1 className='text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4'>
          Welcome Back
        </h1>
        <h2 className='text-lg text-center mb-4 text-ct-dark-200'>
          Login to have access
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5'
          >
            <FormInput label='Email' name='email' type='email' />
            <FormInput label='Password' name='password' type='password' />

            <div className='text-right'>
              <Link href='#' className=''>
                Forgot Password?
              </Link>
            </div>
            <LoadingButton loading={isLoading} textColor='text-ct-blue-600'>
              Login
            </LoadingButton>
            <span className='block'>
              Need an account?{' '}
              <Link href='/register'>
                <a className='text-ct-blue-600'>Sign Up Here</a>
              </Link>
            </span>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      requireAuth: false,
      enableAuth: false,
    },
  };
};

export default LoginPage;
