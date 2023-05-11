import { Injectable } from '@nestjs/common';
import { AttendenceDTO } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendenceInterface } from './interface';

@Injectable()
export class AttendenceService {

    constructor(@InjectModel('Attendence') private readonly attendenceModel: Model<AttendenceInterface>) {}

    async addAttendence(attendenceDTO: AttendenceDTO, user: string) {
        const attendence = new this.attendenceModel({ class: attendenceDTO.class, students: attendenceDTO.students, user: user })
        await attendence.save()

        const rep = await this.attendenceModel.findById(attendence._id).populate("class").populate("students")
        return rep
    }

    async getClassAttendence(classId:string) {
        const rep = await this.attendenceModel.find({ class: classId }).populate("class").populate("students")
        return rep
    }

    async deleteClassAttendence(id:string) {
        const rep = await this.attendenceModel.findByIdAndDelete(id)
        return rep
    }
}
