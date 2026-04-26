
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  schoolId!: string;

  @Prop()
  fullName!: string;

  @Prop({ unique: true })
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  mobileNo!: number;

  @Prop({ enum: UserRole })
  role!: UserRole;

  @Prop()
  phone!: string;

  @Prop()
  profileImage!: string;

  @Prop()
  gender!: string;

  @Prop()
  dob!: Date;

  @Prop()
  address!: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  lastLoginAt!: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);
