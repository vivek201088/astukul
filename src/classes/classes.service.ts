import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from './schema/class.schema';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from '../teacher/schema/teacher.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createClassDto: CreateClassDto,authReq:any): Promise<Class> {
    const schoolId = authReq.user.schoolId;
    const {
      classTeacherId,
      subjects,
      ...rest
    } = createClassDto;

    const teacherObjectId = new Types.ObjectId(classTeacherId);
    const [teacher, classes] = await Promise.all([
      this.teacherModel.findById(teacherObjectId).exec(),
      this.classModel.find({ schoolId }).select('classTeacherId').exec(),
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const isClassTeacher = classes.some(
      (c) => c.classTeacherId?.toString() === teacher.id,
    );

    if (isClassTeacher) {
      throw new ConflictException('Teacher is already assigned as class teacher');
    }

    const createdClass = new this.classModel({
      ...rest,
      schoolId: new Types.ObjectId(schoolId),
      classTeacherId: teacherObjectId,
      subjects: subjects?.map((subject) => ({
        ...subject,
        teacherId: new Types.ObjectId(subject.teacherId),
      })) || [],
    });
    return createdClass.save();
  }

  findAll() {
    return this.classModel
      .find()
      .populate({
        path: 'classTeacherId',
        populate: {
          path: 'userId',
          select: 'fullName',
        },
      })
      .exec();
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

  async assignSubjectTeacher(classId: string, subjectName: string, teacherId: string) {
    const classObjectId = new Types.ObjectId(classId);
    const teacherObjectId = new Types.ObjectId(teacherId);

    const [classDoc, teacherDoc] = await Promise.all([
      this.classModel.findById(classObjectId).exec(),
      this.teacherModel.findById(teacherObjectId).exec(),
    ]);

    if (!classDoc) {
      throw new NotFoundException('Class not found');
    }

    if (!teacherDoc) {
      throw new NotFoundException('Teacher not found');
    }

    const subjectIndex = classDoc.subjects.findIndex(
      (subject) => subject.subjectName.toLowerCase() === subjectName.toLowerCase(),
    );

    if (subjectIndex >= 0) {
      classDoc.subjects[subjectIndex].teacherId = teacherObjectId;
    } else {
      classDoc.subjects.push({
        subjectName,
        teacherId: teacherObjectId,
      } as any);
    }

    await classDoc.save();

    return {
      message: 'Subject teacher assigned successfully',
      class: classDoc,
    };
  }
}
