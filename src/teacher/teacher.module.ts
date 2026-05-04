import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { Class, ClassSchema } from '../classes/schema/class.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, JwtAuthGuard, RolesGuard],
})
export class TeacherModule {}
