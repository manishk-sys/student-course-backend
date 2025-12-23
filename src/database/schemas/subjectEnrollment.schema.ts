import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SubjectEnrollment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ default: 'active' })
  status: 'active' | 'dropped';

  @Prop()
  grade: string;

  @Prop()
  attendancePercentage: number;

  @Prop({ default: Date.now })
  enrolledAt: Date;
}

export const SubjectEnrollmentSchema =
  SchemaFactory.createForClass(SubjectEnrollment);
