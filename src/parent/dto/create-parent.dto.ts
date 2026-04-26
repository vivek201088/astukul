import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ParentRelationType } from '../schema/parent.schema';

export class CreateParentDto {
  @IsMongoId()
  userId!: string;

  @IsString()
  schoolId!: string;

  @IsString()
  fatherName!: string;

  @IsString()
  motherName!: string;

  @IsString()
  occupation!: string;

  @IsNumber()
  annualIncome!: number;

  @IsString()
  alternatePhone!: string;

  @IsString()
  whatsappNumber!: string;

  @IsEnum(ParentRelationType)
  relationType!: ParentRelationType;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  studentIds?: string[];
}
