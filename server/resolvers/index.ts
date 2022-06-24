import UserResolver from './user.resolver';
import PostResolver from './post.resolver';

export const resolvers = [UserResolver, PostResolver] as const;
