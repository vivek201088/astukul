import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher, TeacherDocument } from './schema/teacher.schema';
import { User, UserDocument, UserRole } from '../user/schema/user.schema';
import { Class, ClassDocument } from '../classes/schema/class.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto, authUser: any) {
    const existingUser = await this.userModel.findOne({ email: createTeacherDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    const schoolId = new Types.ObjectId(authUser.schoolId);
    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);

    const createdUser = await this.userModel.create({
      schoolId,
      fullName: createTeacherDto.fullName,
      email: createTeacherDto.email,
      password: hashedPassword,
      mobileNo: createTeacherDto.mobileNo,
      gender: createTeacherDto.gender,
      dob: createTeacherDto.dob,
      address: createTeacherDto.address,
      role: UserRole.TEACHER,
    });

    const createdTeacher = await this.teacherModel.create({
      userId: new Types.ObjectId(createdUser._id),
      schoolId,
      experience: createTeacherDto.experience,
      subjects: createTeacherDto.subjects,
    });

    return {
      message: 'Teacher created successfully',
      user: createdUser,
      teacher: createdTeacher,
    };
  }

  findAll() {
    return this.teacherModel.find().populate('userId', '-password').exec();
  }

  findOne(id: number) {
    return this.teacherModel.findById(id).populate('userId', '-password').exec();
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, { new: true }).populate('userId', '-password').exec();
  }

  remove(id: number) {
    return this.teacherModel.findByIdAndDelete(id).populate('userId', '-password').exec();
  }

  async assignClassTeacher(teacherId: string, classId: string) {
    const teacherObjectId = new Types.ObjectId(teacherId);
    const classObjectId = new Types.ObjectId(classId);

    const [teacher, classDoc] = await Promise.all([
      this.teacherModel.findById(teacherObjectId).exec(),
      this.classModel.findById(classObjectId).exec(),
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (!classDoc) {
      throw new NotFoundException('Class not found');
    }

    // If this class already has a class teacher, unassign that teacher first.
    if (classDoc.classTeacherId) {
      await this.teacherModel
        .findByIdAndUpdate(classDoc.classTeacherId, { $set: { classTeacherOf: null } })
        .exec();
    }

    // If this teacher was class teacher of another class, unassign them there.
    if (teacher.classTeacherOf) {
      await this.classModel
        .findByIdAndUpdate(teacher.classTeacherOf, { $set: { classTeacherId: null } })
        .exec();
    }

    const [updatedTeacher] = await Promise.all([
      this.teacherModel
        .findByIdAndUpdate(
          teacherObjectId,
          { $set: { classTeacherOf: classObjectId } },
          { new: true },
        )
        .populate('userId', '-password')
        .exec(),
      this.classModel
        .findByIdAndUpdate(classObjectId, { $set: { classTeacherId: teacherObjectId } }, { new: true })
        .exec(),
    ]);

    return {
      message: 'Teacher assigned as class teacher successfully',
      teacher: updatedTeacher,
    };
  }
}
