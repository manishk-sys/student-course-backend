import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  // Many-to-many: array of User IDs
//   @Prop([{ type: Types.ObjectId, ref: 'User' }])
//   students: Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);


// 👇 Virtual field
CourseSchema.virtual('students', {
  ref: 'User',
  localField: '_id',
  foreignField: 'courses',
});


CourseSchema.set('toObject', { virtuals: true });
CourseSchema.set('toJSON', { virtuals: true });