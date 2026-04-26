import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ParentRelationType {
  FATHER = 'father',
  MOTHER = 'mother',
  GUARDIAN = 'guardian',
}

export type ParentDocument = HydratedDocument<Parent>;

@Schema({ timestamps: true })
export class Parent {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop()
  schoolId!: string;

  @Prop()
  fatherName!: string;

  @Prop()
  motherName!: string;

  @Prop()
  occupation!: string;

  @Prop()
  annualIncome!: number;

  @Prop()
  alternatePhone!: string;

  @Prop()
  whatsappNumber!: string;

  @Prop({ enum: ParentRelationType })
  relationType!: ParentRelationType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  studentIds!: Types.ObjectId[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
