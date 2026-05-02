import { IsArray, IsDateString, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsNumber()
  mobileNo!: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  experience!: number;

  @IsArray()
  @IsString({ each: true })
  subjects!: string[];
}
