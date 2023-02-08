import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { LectureDTO } from './dto/lecture.dto';
import { LectureInterface } from './interface';

@Injectable()
export class LectureService {
    constructor(
        @InjectModel('Lecture')
        private readonly lectureModel: Model<LectureInterface>,
    ) { }

    async createLecture(
        user: AuthInterface,
        lectureDTO: LectureDTO,
        file: Express.Multer.File,
    ) {
        let newLecture = new this.lectureModel({
            user: user,
            title: lectureDTO.title,
            description: lectureDTO.description,
            classID: lectureDTO.classID,
            subjectID: lectureDTO.subjectID,
            file: file.path,
        });
        await newLecture.save()
        newLecture = await this.lectureModel.findById(newLecture._id).populate("user").populate("classID").populate("subjectID")
        return newLecture
    }

    async getLecturesOfClass(id: string){
        const lectures = await this.lectureModel.find({ classID: id }).populate("user").populate("classID").populate("subjectID")
        return lectures
    }

    async getLecture(id: string){
        const lectures = await this.lectureModel.findById(id).populate("user").populate("classID").populate("subjectID")
        return lectures
    }

    async deleteLecture(id: string){
        const lectures = await this.lectureModel.findByIdAndDelete(id)
        return lectures
    }
}
