import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniversityInterface } from 'src/user/interface';
import { ClassDTO } from './dto';
import { ClassInterface } from './interface';

@Injectable()
export class ClassService {

    constructor(@InjectModel("Class") private readonly classModel:Model<ClassInterface>) {}

    async createClass(classDTO: ClassDTO) {
        const classInstance = new this.classModel(classDTO)
        await classInstance.save()
        return classInstance
    }

    async deleteClass(id: string) {
        const classInstance = await this.classModel.findByIdAndDelete(id)
        return classInstance
    }
}
