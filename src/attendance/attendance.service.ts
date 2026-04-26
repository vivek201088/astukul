import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './schema/attendance.schema';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Single student create endpoint.
    const attendanceDate = new Date(createAttendanceDto.date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const attendance = await this.attendanceModel
      .findOneAndUpdate(
        {
          studentId: createAttendanceDto.studentId,
          date: attendanceDate,
        },
        {
          $set: {
            schoolId: createAttendanceDto.schoolId,
            date: attendanceDate,
            studentId: createAttendanceDto.studentId,
            classId: createAttendanceDto.classId,
            status: createAttendanceDto.status,
            markedBy: createAttendanceDto.markedBy,
            remarks: createAttendanceDto.remarks ?? '',
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();

    return attendance;
  }

  async mark(markAttendanceDto: MarkAttendanceDto): Promise<Attendance[]> {
    // Normalize to day-level key to honor one attendance per student per day.
    const requestedDate = new Date(markAttendanceDto.date);
    const attendanceDate = new Date(
      Date.UTC(
        requestedDate.getUTCFullYear(),
        requestedDate.getUTCMonth(),
        requestedDate.getUTCDate(),
      ),
    );
    const nextDate = new Date(attendanceDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    const classObjectId = new Types.ObjectId(markAttendanceDto.classId);
    const markedByObjectId = markAttendanceDto.markedBy
      ? new Types.ObjectId(markAttendanceDto.markedBy)
      : undefined;
    const studentObjectIds = markAttendanceDto.students.map(
      (student) => new Types.ObjectId(student.studentId),
    );

    const operations = markAttendanceDto.students.map((student, index) => ({
      updateOne: {
        filter: {
          studentId: studentObjectIds[index],
          date: attendanceDate,
        },
        update: {
          $set: {
            schoolId: markAttendanceDto.schoolId,
            date: attendanceDate,
            studentId: studentObjectIds[index],
            classId: classObjectId,
            status: student.status,
            markedBy: markedByObjectId,
            remarks: student.remarks ?? '',
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.attendanceModel.bulkWrite(operations, { ordered: false });
    }

    return this.attendanceModel
      .find({
        schoolId: markAttendanceDto.schoolId,
        classId: classObjectId,
        date: { $gte: attendanceDate, $lt: nextDate },
        studentId: { $in: studentObjectIds },
      })
      .exec();
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.find().exec();
  }

  async findOne(id: string): Promise<Attendance | null> {
    return this.attendanceModel.findById(id).exec();
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance | null> {
    return this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Attendance | null> {
    return this.attendanceModel.findByIdAndDelete(id).exec();
  }
}
