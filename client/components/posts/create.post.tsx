import React, { FC, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FileUpLoader from '../FileUpload';
import { LoadingButton } from '../LoadingButton';
import TextInput from '../TextInput';
import { useCreatePostMutation } from '../../generated/graphql';
import graphqlRequestClient, {
  queryClient,
} from '../../requests/graphqlRequestClient';
import { toast } from 'react-toastify';
import useStore from '../../store';

const createPostSchema = object({
  title: string().min(1, 'Title is required'),
  category: string().min(1, 'Category is required'),
  content: string().min(1, 'Content is required'),
  image: string().min(1, 'Image is required'),
});

type CreatePostInput = TypeOf<typeof createPostSchema>;

type ICreatePostProp = {
  setOpenPostModal: (openPostModal: boolean) => void;
};

const CreatePost: FC<ICreatePostProp> = ({ setOpenPostModal }) => {
  const store = useStore();
  const { isLoading, mutate: createPost } = useCreatePostMutation(
    graphqlRequestClient,
    {
      onSuccess(data) {
        store.setPageLoading(false);
        setOpenPostModal(false);
        queryClient.refetchQueries('GetAllPosts');
        toast('Post created successfully', {
          type: 'success',
          position: 'top-right',
        });
      },
      onError(error: any) {
        store.setPageLoading(false);
        setOpenPostModal(false);
        error.response.errors.forEach((err: any) => {
          toast(err.message, {
            type: 'error',
            position: 'top-right',
          });
        });
      },
    }
  );
  const methods = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (isLoading) {
      store.setPageLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmitHandler: SubmitHandler<CreatePostInput> = async (data) => {
    createPost({ input: data });
  };
  return (
    <section>
      <h2 className='text-2xl font-semibold mb-4'>Create Post</h2>

      <FormProvider {...methods}>
        <form className='w-full' onSubmit={handleSubmit(onSubmitHandler)}>
          <TextInput name='title' label='Title' />
          <TextInput name='category' label='Category' />
          <div className='mb-2'>
            <label className='block text-gray-700 text-lg mb-2' htmlFor='title'>
              Content
            </label>
            <textarea
              className={twMerge(
                `appearance-none border border-ct-dark-200 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
                `${errors.content && 'border-red-500'}`
              )}
              rows={4}
              {...register('content')}
            />
            <p
              className={twMerge(
                `text-red-500 text-xs italic mb-2 invisible`,
                `${errors.content && 'visible'}`
              )}
            >
              {errors.content ? errors.content.message : ''}
            </p>
          </div>
          <FileUpLoader name='image' />
          <LoadingButton loading={isLoading} textColor='text-ct-blue-600'>
            Create Post
          </LoadingButton>
        </form>
      </FormProvider>
    </section>
  );
};

export default CreatePost;
