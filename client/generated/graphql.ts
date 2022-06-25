import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables, headers?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  access_token: Scalars['String'];
  status: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: PostResponse;
  deletePost: Scalars['Boolean'];
  loginUser: LoginResponse;
  signupUser: UserResponse;
  updatePost: PostResponse;
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['String'];
};


export type MutationLoginUserArgs = {
  input: LoginInput;
};


export type MutationSignupUserArgs = {
  input: SignUpInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['String'];
  input: UpdatePostInput;
};

export type PostData = {
  __typename?: 'PostData';
  _id: Scalars['String'];
  category: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: Scalars['String'];
};

export type PostFilter = {
  limit?: InputMaybe<Scalars['Float']>;
  page?: InputMaybe<Scalars['Float']>;
};

export type PostInput = {
  category: Scalars['String'];
  content: Scalars['String'];
  image: Scalars['String'];
  title: Scalars['String'];
};

export type PostListResponse = {
  __typename?: 'PostListResponse';
  posts: Array<PostPopulatedData>;
  results: Scalars['Float'];
  status: Scalars['String'];
};

export type PostPopulatedData = {
  __typename?: 'PostPopulatedData';
  _id: Scalars['String'];
  category: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: UserData;
};

export type PostPopulatedResponse = {
  __typename?: 'PostPopulatedResponse';
  post: PostPopulatedData;
  status: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  post: PostData;
  status: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getMe: UserResponse;
  getPost: PostPopulatedResponse;
  getPosts: PostListResponse;
  logoutUser: Scalars['Boolean'];
  refreshAccessToken: LoginResponse;
};


export type QueryGetPostArgs = {
  id: Scalars['String'];
};


export type QueryGetPostsArgs = {
  input?: InputMaybe<PostFilter>;
};

export type SignUpInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirm: Scalars['String'];
  photo: Scalars['String'];
};

export type UpdatePostInput = {
  category?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UserData = {
  __typename?: 'UserData';
  _id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  photo: Scalars['String'];
  role: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  status: Scalars['String'];
  user: UserData;
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getMe: { __typename?: 'UserResponse', status: string, user: { __typename?: 'UserData', _id: string, id?: string | null, email: string, name: string, role: string, photo: string, updatedAt: any, createdAt: any } } };

export type LoginUserMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'LoginResponse', status: string, access_token: string } };

export type LogoutUserQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserQuery = { __typename?: 'Query', logoutUser: boolean };

export type RefreshAccessTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type RefreshAccessTokenQuery = { __typename?: 'Query', refreshAccessToken: { __typename?: 'LoginResponse', status: string, access_token: string } };

export type SignUpUserMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpUserMutation = { __typename?: 'Mutation', signupUser: { __typename?: 'UserResponse', status: string, user: { __typename?: 'UserData', name: string, email: string, photo: string, role: string } } };


export const GetMeDocument = `
    query GetMe {
  getMe {
    status
    user {
      _id
      id
      email
      name
      role
      photo
      updatedAt
      createdAt
    }
  }
}
    `;
export const useGetMeQuery = <
      TData = GetMeQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetMeQueryVariables,
      options?: UseQueryOptions<GetMeQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetMeQuery, TError, TData>(
      variables === undefined ? ['GetMe'] : ['GetMe', variables],
      fetcher<GetMeQuery, GetMeQueryVariables>(client, GetMeDocument, variables, headers),
      options
    );
export const LoginUserDocument = `
    mutation LoginUser($input: LoginInput!) {
  loginUser(input: $input) {
    status
    access_token
  }
}
    `;
export const useLoginUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LoginUserMutation, TError, LoginUserMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<LoginUserMutation, TError, LoginUserMutationVariables, TContext>(
      ['LoginUser'],
      (variables?: LoginUserMutationVariables) => fetcher<LoginUserMutation, LoginUserMutationVariables>(client, LoginUserDocument, variables, headers)(),
      options
    );
export const LogoutUserDocument = `
    query LogoutUser {
  logoutUser
}
    `;
export const useLogoutUserQuery = <
      TData = LogoutUserQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: LogoutUserQueryVariables,
      options?: UseQueryOptions<LogoutUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<LogoutUserQuery, TError, TData>(
      variables === undefined ? ['LogoutUser'] : ['LogoutUser', variables],
      fetcher<LogoutUserQuery, LogoutUserQueryVariables>(client, LogoutUserDocument, variables, headers),
      options
    );
export const RefreshAccessTokenDocument = `
    query RefreshAccessToken {
  refreshAccessToken {
    status
    access_token
  }
}
    `;
export const useRefreshAccessTokenQuery = <
      TData = RefreshAccessTokenQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: RefreshAccessTokenQueryVariables,
      options?: UseQueryOptions<RefreshAccessTokenQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<RefreshAccessTokenQuery, TError, TData>(
      variables === undefined ? ['RefreshAccessToken'] : ['RefreshAccessToken', variables],
      fetcher<RefreshAccessTokenQuery, RefreshAccessTokenQueryVariables>(client, RefreshAccessTokenDocument, variables, headers),
      options
    );
export const SignUpUserDocument = `
    mutation SignUpUser($input: SignUpInput!) {
  signupUser(input: $input) {
    status
    user {
      name
      email
      photo
      role
    }
  }
}
    `;
export const useSignUpUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<SignUpUserMutation, TError, SignUpUserMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<SignUpUserMutation, TError, SignUpUserMutationVariables, TContext>(
      ['SignUpUser'],
      (variables?: SignUpUserMutationVariables) => fetcher<SignUpUserMutation, SignUpUserMutationVariables>(client, SignUpUserDocument, variables, headers)(),
      options
    );