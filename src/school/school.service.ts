import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from './school/school.schema';
import { Student, StudentDocument, StudentStatus } from '../student/schema/student.schema';
import { CreateAdmissionDto } from './dto/create-admission.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) { }

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const createdSchool = new this.schoolModel(createSchoolDto);
    return createdSchool.save();
  }

  async createAdmission(createAdmissionDto: CreateAdmissionDto): Promise<Student> {
    const school = await this.schoolModel.findById(createAdmissionDto.schoolId).exec();
    if (!school) {
      throw new NotFoundException(`School with ID ${createAdmissionDto.schoolId} not found`);
    }

    const count = await this.studentModel.countDocuments({
      schoolId: createAdmissionDto.schoolId,
    });

    const admissionNo = `${school.schoolCode}-2026-${String(count + 1).padStart(4, '0')}`;

    return this.studentModel.create({
      ...createAdmissionDto,
      admissionNo,
    });
  }

  findAll() {
    return `This action returns all school`;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
