import { IsEmail, IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { UserRole } from '../../user/schema/user.schema';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsNumber()
  mobileNo!: number;

  @IsEnum(UserRole)
  role!: UserRole;
}