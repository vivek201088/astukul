import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent, ParentDocument } from './schema/parent.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<ParentDocument>,
  ) {}

  async create(createParentDto: CreateParentDto): Promise<Parent> {
    const createdParent = new this.parentModel(createParentDto);
    return createdParent.save();
  }

  async findAll(): Promise<Parent[]> {
    return this.parentModel.find().exec();
  }

  async findOne(id: string): Promise<Parent> {
    const parent = await this.parentModel.findById(id).exec();
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto): Promise<Parent> {
    const updatedParent = await this.parentModel
      .findByIdAndUpdate(id, updateParentDto, { new: true })
      .exec();
    if (!updatedParent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return updatedParent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.parentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
  }
}
