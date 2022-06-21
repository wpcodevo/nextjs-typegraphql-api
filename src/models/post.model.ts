import {
  getModelForClass,
  ModelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Post {
  readonly _id: string;

  @prop({ required: true, unique: true })
  title: string;

  @prop({ required: true })
  content: string;

  @prop({ required: true })
  category: string;

  @prop({ default: 'default.jpeg' })
  image: string;

  @prop({ required: true, ref: () => User })
  user: Ref<User>;
}

const PostModel = getModelForClass<typeof Post>(Post);
export default PostModel;
