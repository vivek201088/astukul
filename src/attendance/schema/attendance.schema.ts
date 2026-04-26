import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LEAVE = 'leave',
  LATE = 'late',
}

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop()
  schoolId!: string;

  @Prop()
  date!: Date;

  @Prop({ type: Types.ObjectId, ref: 'Student' })
  studentId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class' })
  classId!: Types.ObjectId;

  @Prop({ enum: AttendanceStatus })
  status!: AttendanceStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  markedBy!: Types.ObjectId;

  @Prop()
  remarks!: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
