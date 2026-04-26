import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../schema/attendance.schema';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  schoolId!: string;

  @IsDateString()
  date!: string;

  @IsMongoId()
  studentId!: string;

  @IsMongoId()
  classId!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsMongoId()
  markedBy!: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
