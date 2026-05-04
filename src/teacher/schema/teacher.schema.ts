import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId!: Types.ObjectId;

  @Prop({ required: true })
  experience!: number;

  @Prop({ type: [String], default: [] })
  subjects!: string[];

  @Prop({ type: Types.ObjectId, ref: 'Class', default: null })
  classTeacherOf?: Types.ObjectId | null;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
