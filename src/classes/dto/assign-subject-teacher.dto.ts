import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AssignSubjectTeacherDto {
  @IsString()
  @IsNotEmpty()
  subjectName!: string;

  @IsMongoId()
  teacherId!: string;
}
