import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schema/teacher.schema';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const createdTeacher = new this.teacherModel(createTeacherDto);
    return createdTeacher.save();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().exec();
  }

  async findOne(id: string): Promise<Teacher | null> {
    return this.teacherModel.findById(id).exec();
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher | null> {
    return this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Teacher | null> {
    return this.teacherModel.findByIdAndDelete(id).exec();
  }
}
