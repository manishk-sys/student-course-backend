import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subject extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  credits: number;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);