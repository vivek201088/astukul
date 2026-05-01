import { IsString, IsEmail, IsEnum, IsBoolean, IsDateString, IsOptional, IsNumber, IsMongoId } from 'class-validator';
import { UserRole } from '../schema/user.schema';


export class CreateUserDto {
  @IsMongoId()
  schoolId!: string;

  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsNumber()
  mobileNo!: number;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
