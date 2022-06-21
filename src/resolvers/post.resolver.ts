import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  PostFilter,
  PostInput,
  PostListResponse,
  PostPopulatedResponse,
  PostResponse,
  UpdatePostInput,
} from '../schemas/post.schema';
import PostService from '../services/post.service';
import type { Context } from '../types/context';

@Resolver()
export default class PostResolver {
  constructor(private postService: PostService) {
    this.postService = new PostService();
  }

  @Mutation(() => PostResponse)
  async createPost(@Arg('input') input: PostInput, @Ctx() ctx: Context) {
    return this.postService.createPost(input, ctx);
  }

  @Query(() => PostPopulatedResponse)
  async getPost(@Arg('id') id: string, @Ctx() ctx: Context) {
    return this.postService.getPost(id, ctx);
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg('id') id: string,
    @Arg('input') input: UpdatePostInput,
    @Ctx() ctx: Context
  ) {
    return this.postService.updatePost(id, input, ctx);
  }

  @Query(() => PostListResponse)
  async getPosts(
    @Arg('input', { nullable: true }) input: PostFilter,
    @Ctx() ctx: Context
  ) {
    return this.postService.getPosts(input, ctx);
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: string, @Ctx() ctx: Context) {
    return this.postService.deletePost(id, ctx);
  }
}
