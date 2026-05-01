import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeacherStatus } from '../schema/teacher.schema';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  schoolId!: string;

  @IsMongoId()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  employeeCode!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @IsDateString()
  dob!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  qualification!: string;

  @IsString()
  @IsNotEmpty()
  specialization!: string;

  @IsNumber()
  experienceYears!: number;

  @IsDateString()
  joiningDate!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @IsMongoId()
  @IsOptional()
  classTeacherOf?: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  emergencyContact!: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsEnum(TeacherStatus)
  @IsOptional()
  status?: TeacherStatus;

  @IsMongoId()
  createdBy!: string;
}
