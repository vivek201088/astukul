import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum StudentStatus {
  ACTIVE = 'active',
  LEFT = 'left',
  GRADUATED = 'graduated',
}

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop()
  schoolId!: string;

  @Prop()
  admissionNo!: string;

  @Prop()
  rollNumber!: string;

  @Prop()
  firstName!: string;

  @Prop()
  lastName!: string;

  @Prop()
  fullName!: string;

  @Prop()
  gender!: string;

  @Prop()
  dob!: Date;

  @Prop()
  bloodGroup!: string;

  @Prop()
  profileImage!: string;

  @Prop()
  classId!: string;

  @Prop()
  section!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  parentId!: Types.ObjectId;

  @Prop()
  emergencyContact!: string;

  @Prop()
  address!: string;

  @Prop()
  admissionDate!: Date;

  @Prop({ enum: StudentStatus, default: StudentStatus.ACTIVE })
  status!: StudentStatus;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
