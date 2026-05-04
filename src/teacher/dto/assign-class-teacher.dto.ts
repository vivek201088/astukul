import { IsMongoId } from 'class-validator';

export class AssignClassTeacherDto {
  @IsMongoId()
  classId!: string;
}
