import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher, TeacherDocument } from './schema/teacher.schema';
import { User, UserDocument, UserRole } from '../user/schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    return `This action returns all teacher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
