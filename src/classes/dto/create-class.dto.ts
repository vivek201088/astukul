import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateClassSubjectDto {
  @IsString()
  @IsNotEmpty()
  subjectName!: string;

  @IsMongoId()
  teacherId!: string;
}

export class CreateClassDto {
  @IsMongoId()
  schoolId!: string;

  @IsString()
  @IsNotEmpty()
  className!: string;

  @IsString()
  @IsNotEmpty()
  section!: string;

  @IsString()
  @IsNotEmpty()
  academicYear!: string;

  @IsMongoId()
  classTeacherId!: string;

  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

  @IsNumber()
  capacity!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassSubjectDto)
  @IsOptional()
  subjects?: CreateClassSubjectDto[];
}
