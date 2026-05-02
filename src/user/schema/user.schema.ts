
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum UserRole {
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId!: Types.ObjectId;

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
  gender!: string;

  @Prop()
  dob!: Date;

  @Prop()
  address!: string;

  @Prop({ default: true })
  isActive!: boolean;

}


export const UserSchema = SchemaFactory.createForClass(User);
