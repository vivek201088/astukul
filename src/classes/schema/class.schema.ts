import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class ClassSubject {
  @Prop()
  subjectName!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  teacherId!: Types.ObjectId;
}

export const ClassSubjectSchema = SchemaFactory.createForClass(ClassSubject);

export type ClassDocument = HydratedDocument<Class>;

@Schema({ timestamps: true })
export class Class {
  @Prop()
  schoolId!: string;

  @Prop()
  className!: string;

  @Prop()
  section!: string;

  @Prop()
  academicYear!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  classTeacherId!: Types.ObjectId;

  @Prop()
  roomNumber!: string;

  @Prop()
  capacity!: number;

  @Prop({ type: [ClassSubjectSchema], default: [] })
  subjects!: ClassSubject[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
