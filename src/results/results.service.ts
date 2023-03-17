import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignRolesInterface, DefineRolesInterface } from 'src/administration/interface/roles.interface';
import { AuthInterface } from 'src/authentication/interface';
import { ResultDTO } from './dto';
import { ResultsInterface, StudentMarksInterface } from './interface';
import * as argon from 'argon2';

@Injectable()
export class ResultsService {
    constructor(
        @InjectModel('Result')
        private readonly resultsModel: Model<ResultsInterface>,
        @InjectModel('Student Mark')
        private readonly studentMarksModel: Model<StudentMarksInterface>,
        @InjectModel('Auth') private readonly authModel: Model<AuthInterface>,
        @InjectModel('Role')
        private readonly assignRoleModel: Model<AssignRolesInterface>,
        @InjectModel('Roles Definition')
        private readonly defineRoleModel: Model<DefineRolesInterface>,
    ) { }

    async createResult(user: string, resultsDto: ResultDTO, file: Express.Multer.File, university: string){
        let array = file.buffer.toString().split('\r');

        array = array.filter((a) => a != '\n');

        const headers = array[0].toLowerCase().split(',');

        const result = new this.resultsModel({ name: resultsDto.name, classID: resultsDto.classID, subjectID: resultsDto.subjectID, user: user, university: university })
        await result.save()

        const students = [];

        for (let i = 0; i < array.length - 1; i++) {
            let obj = {};
            let data = array[i + 1].split(',');

            data = data.filter((a) => a != '');

            if (data.length !== headers.length)
                throw new ForbiddenException(
                    `Null values not accepted!!. ${students.length} students added`,
                );

            for (let j = 0; j < headers.length; j++) {
                obj[`${headers[j]}`] = data[j].replace(/[\r\n]/gm, '');
            }
            students.push(obj);
        }

        const studentRole = await this.defineRoleModel.findOne({
            university: university,
            name: 'STUDENT',
        });

        if (!studentRole) throw new ForbiddenException('No STUDENT role found');

        const data = []
        
        for (let i = 0; i < students.length; i++) {
            const obj = students[i]
            const email = Object.keys(obj).map((key) => obj[key])[0]
            
            let user = await this.authModel.findOne({ email: email });
            if (!user) {
                const hash = await argon.hash(email);
                user = new this.authModel({ email: email, password: hash });
                user.save();
                const assignRoleToStudent = new this.assignRoleModel({
                    user: user._id,
                    roles: studentRole._id,
                    university: university,
                });
                assignRoleToStudent.save();
            }
            
            const marks = new this.studentMarksModel({ user: user._id, result: result._id, marks: parseFloat(students[i].marks), maxMarks: parseFloat(students[i].max_marks) })
            await marks.save()

            const feedData = await this.studentMarksModel.findById(marks._id).populate("result").populate("user")

            data.push(feedData)
        }

        const response = await this.resultsModel.findById(result._id).populate("classID").populate("subjectID").populate("user")
        return response
    }

    async getResult(university: string, user: string){

        const assignRole = await <any>this.assignRoleModel.findOne({ user: user, university: university }).populate("roles")

        if(assignRole.roles.name == 'STUDENT') {
            
            const marks = await <any>this.studentMarksModel.find({ user: user })

            const results = []

            for (let i = 0; i < marks.length; i++) {
                const r = await this.resultsModel.findById(marks[i].result._id).populate("classID").populate("subjectID").populate("user")
                results.push(r)
            }

            return results

        } else if(assignRole.roles.name == 'FACULTY') {

            const results = await this.resultsModel.find({ user: user }).populate("classID").populate("subjectID").populate("user")
            return results
        }

        const results = await this.resultsModel.find({ university: university }).populate("classID").populate("subjectID").populate("user")
        return results
    }

    async getSingleResult (resultID: string, user: string) {
        const result = await this.studentMarksModel.findOne({ result: resultID, user: user }).populate("result").populate("user")
        return result
    }

    async deleteResult(data: [string]){
        for (let i = 0; i < data.length; i++) {
            await this.resultsModel.findByIdAndDelete(data[i])
        }
        return  data
    }
}
