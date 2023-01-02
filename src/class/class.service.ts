import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { AssignmentDTO, ClassDTO, SubjectDTO } from './dto';
import * as argon from "argon2"
import { AssignmentInterface, ClassInterface, NotesInterface } from './interface';

@Injectable()
export class ClassService {

    constructor(@InjectModel("Class") private readonly classModel: Model<ClassInterface>, @InjectModel("Auth") private readonly authModel: Model<AuthInterface>, @InjectModel("Note") private readonly notesModel: Model<NotesInterface>, @InjectModel("Assignment") private readonly assignmentModel: Model<AssignmentInterface>) { }

    async createClass(classDTO: ClassDTO) {
        const classInstance = new this.classModel(classDTO)
        await classInstance.save()
        return classInstance
    }

    async deleteClass(id: string) {
        const classInstance = await this.classModel.findByIdAndDelete(id)
        return classInstance
    }

    async addStudents(id: string, file: Express.Multer.File) {
        let array = file.buffer.toString().split("\r")

        array = array.filter(a => a != "\n")

        const headers = array[0].toLowerCase().split(",")

        const students = []

        for (let i = 0; i < array.length - 1; i++) {
            let obj = {}
            let data = array[i + 1].split(",")

            data = data.filter(a => a != '')

            if (data.length !== headers.length) throw new ForbiddenException(`Null values not accepted!!. ${students.length} students added`)

            for (let j = 0; j < headers.length; j++) {
                obj[`${headers[j]}`] = data[j].replace(/[\r\n]/gm, '')
            }
            students.push(obj)
        }

        const studentsID = []

        for (let i = 0; i < students.length; i++) {
            let user = await this.authModel.findOne({ email: students[i].email })
            if (!user) {
                const hash = await argon.hash(students[i].email);
                user = new this.authModel({ email: students[i].email, password: hash })
                user.save()
            }
            studentsID.push(user._id)
        }

        let newClass = await this.classModel.findByIdAndUpdate(id, { students: studentsID })
        console.log(newClass);

        newClass = await this.classModel.findById(id)
        return newClass
    }

    async addFaculty(id: string, file: Express.Multer.File) {
        let array = file.buffer.toString().split("\r")

        array = array.filter(a => a != "\n")

        const headers = array[0].toLowerCase().split(",")

        const faculty = []

        for (let i = 0; i < array.length - 1; i++) {
            let obj = {}
            let data = array[i + 1].split(",")

            data = data.filter(a => a != '')

            if (data.length !== headers.length) throw new ForbiddenException(`Null values not accepted!!. ${faculty.length} faculty added`)

            for (let j = 0; j < headers.length; j++) {
                obj[`${headers[j]}`] = data[j].replace(/[\r\n]/gm, '')
            }
            faculty.push(obj)
        }

        const facultyID = []

        for (let i = 0; i < faculty.length; i++) {
            let user = await this.authModel.findOne({ email: faculty[i].email })
            if (!user) {
                const hash = await argon.hash(faculty[i].email);
                user = new this.authModel({ email: faculty[i].email, password: hash })
                user.save()
            }
            facultyID.push(user._id)
        }

        let newClass = await this.classModel.findByIdAndUpdate(id, { faculty: facultyID })

        newClass = await this.classModel.findById(id)
        return newClass
    }

    async addNotes(id: string, files: Array<Express.Multer.File>) {
        console.log(id, files);
        return "let to come"
    }

    async deleteNotes(id: string) {
        const note = await this.notesModel.findByIdAndDelete(id)
        return note
    }

    async addAssignment(id: string, files: Array<Express.Multer.File>, assignmentDTO:AssignmentDTO) {
        console.log(id, files);
        return assignmentDTO
    }

    async deleteAssignment(id: string) {
        const assignment = await this.assignmentModel.findByIdAndDelete(id)
        return assignment
    }

    async createSubject(subjectDTO: SubjectDTO, classID: string) {}
}
