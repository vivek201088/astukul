import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from './schema/class.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const {
      schoolId,
      classTeacherId,
      subjects,
      ...rest
    } = createClassDto;

    const createdClass = new this.classModel({
      ...rest,
      schoolId: new Types.ObjectId(schoolId),
      classTeacherId: new Types.ObjectId(classTeacherId),
      subjects: subjects?.map((subject) => ({
        ...subject,
        teacherId: new Types.ObjectId(subject.teacherId),
      })) || [],
    });
    return createdClass.save();
  }

  findAll() {
    return `This action returns all classes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
