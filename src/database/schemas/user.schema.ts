import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from './post.schema';

@Schema()
class Profile {
  @Prop()
  age: number;

  @Prop()
  bio: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  age?: number;

  @Prop({ type: ProfileSchema })
  profile: Profile;

  // Many-to-many: array of Course IDs
  @Prop([{ type: Types.ObjectId, ref: 'Course' }])
  courses: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * 🔥 Virtual populate: User -> Posts
 */
UserSchema.virtual('posts', {
  ref: 'Post', // model to populate
  localField: '_id', // User._id
  foreignField: 'author', // Post.author
});

/**
 * Enable virtuals in JSON responses
 */
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
