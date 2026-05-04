import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AssignSubjectTeacherDto } from './dto/assign-subject-teacher.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/schema/user.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createClassDto: CreateClassDto, @Request() req: any) {
    return this.classesService.create(createClassDto, req);
  }

  @Get()  
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Patch(':id/assign-subject-teacher')
  assignSubjectTeacher(@Param('id') id: string, @Body() assignSubjectTeacherDto: AssignSubjectTeacherDto) {
    return this.classesService.assignSubjectTeacher(
      id,
      assignSubjectTeacherDto.subjectName,
      assignSubjectTeacherDto.teacherId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
}
