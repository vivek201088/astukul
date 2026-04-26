import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum HomeworkStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export type HomeworkDocument = HydratedDocument<Homework>;

@Schema({ timestamps: true })
export class Homework {
  @Prop()
  schoolId!: string;

  @Prop({ type: Types.ObjectId, ref: 'Class' })
  classId!: Types.ObjectId;

  @Prop()
  subjectName!: string;

  @Prop()
  title!: string;

  @Prop()
  description!: string;

  @Prop()
  attachmentUrl!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedBy!: Types.ObjectId;

  @Prop()
  assignedDate!: Date;

  @Prop()
  dueDate!: Date;

  @Prop({ enum: HomeworkStatus, default: HomeworkStatus.ACTIVE })
  status!: HomeworkStatus;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
