import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../schema/attendance.schema';

class MarkAttendanceStudentDto {
  @IsMongoId()
  studentId!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class MarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  schoolId!: string;

  @IsMongoId()
  classId!: string;

  @IsDateString()
  date!: string;

  @IsMongoId()
  @IsOptional()
  markedBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceStudentDto)
  students!: MarkAttendanceStudentDto[];
}
