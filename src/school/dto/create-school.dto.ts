import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BoardType } from '../school/school.schema';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  schoolCode!: string;

  @IsString()
  @IsNotEmpty()
  schoolName!: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  addressLine1!: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  pincode!: string;

  @IsEnum(BoardType)
  boardType!: BoardType;

  @IsString()
  @IsNotEmpty()
  principalName!: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsNotEmpty()
  timezone!: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  academicYear!: string;

  @IsString()
  @IsNotEmpty()
  subscriptionPlan!: string;

  @IsDateString()
  subscriptionStartDate!: string;

  @IsDateString()
  subscriptionEndDate!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  createdBy!: string;
}
