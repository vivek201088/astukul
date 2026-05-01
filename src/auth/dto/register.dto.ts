import { IsEmail, IsNotEmpty, IsString, IsEnum, IsNumber, IsMongoId } from 'class-validator';
import { UserRole } from '../../user/schema/user.schema';

export class RegisterDto {
  @IsString()
  @IsMongoId()
  schoolId!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

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
