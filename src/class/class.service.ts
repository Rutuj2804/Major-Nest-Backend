import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { AssignmentDTO, ClassDTO, ManulStudentAddDTO, SubjectDTO } from './dto';
import * as argon from "argon2"
import { AssignmentInterface, ClassInterface, NotesInterface, SubjectInterface } from './interface';

@Injectable()
export class ClassService {

    constructor(
        @InjectModel("Class") private readonly classModel: Model<ClassInterface>, 
        @InjectModel("Auth") private readonly authModel: Model<AuthInterface>, 
        @InjectModel("Note") private readonly notesModel: Model<NotesInterface>, 
        @InjectModel("Assignment") private readonly assignmentModel: Model<AssignmentInterface>,
        @InjectModel("Subject") private readonly subjectModel: Model<SubjectInterface>,
    ) { }

    async createClass(classDTO: ClassDTO) {
        const classInstance = new this.classModel(classDTO)
        await classInstance.save()
        return classInstance
    }

    async updateClass(classDTO: ClassDTO, id: string) {
        const classInstance = await this.classModel.findByIdAndUpdate(id, classDTO)
        return classInstance
    }

    async deleteClass(id: string) {
        const classInstance = await this.classModel.findByIdAndDelete(id)
        return classInstance
    }

    async getAllClasses(id: string) {
        try {
            const classes = await this.classModel.find({ university: id })
            return classes
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }

    async getClassByID(id: string) {
        try {
            const classes = await this.classModel.findById(id)
            return classes
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }

    async getMyClasses(id: string, user: string) {
        try {
            const classes = await this.classModel.find({ university: id, faculty: user })
            return classes
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }

    async getMySubjects(user: string) {
        try {
            const classID = await this.classModel.findOne({ students: user })
            const subjects = await this.subjectModel.find({ class: classID })
            return subjects
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
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

        newClass = await this.classModel.findById(id)
        return newClass
    }

    async addStudentManual(id: string, manulStudentAddDTO: ManulStudentAddDTO) {
        try {
            let user = await this.authModel.findOne({ email: manulStudentAddDTO.email })
            if (!user) {
                const hash = await argon.hash(manulStudentAddDTO.email);
                user = new this.authModel({ email: manulStudentAddDTO.email, password: hash })
                user.save()
            }
            const classInstance = await this.classModel.findByIdAndUpdate(id, { $push: { students: user._id } }, { returnOriginal: false }).populate("students").populate("faculty")

            return classInstance
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }

    async deleteStudentsFromClass(id: string, students: [string]) {
        try {
            const classInstance = await this.classModel.findByIdAndUpdate(id, { $pullAll: { students: students } }, { returnOriginal: false }).populate("students").populate("faculty")
            return classInstance
        } catch (error) {
            console.log(error);
            
            throw new ForbiddenException("Something went wrong while deleting students")
        }
    }

    async getAllStudents(id: string) {
        try {
            const res = await this.classModel.find({ university: id }).populate("students").populate("faculty")
            return res
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }

    async getStudentsOfFaculty(id: string, user: string) {
        try {
            const res = await this.classModel.find({ university: id, faculty: user }).populate("students").populate("faculty")
            return res
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
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

    async addFacultyManual(id: string, manulStudentAddDTO: ManulStudentAddDTO) {
        try {
            let user = await this.authModel.findOne({ email: manulStudentAddDTO.email })
            if (!user) {
                const hash = await argon.hash(manulStudentAddDTO.email);
                user = new this.authModel({ email: manulStudentAddDTO.email, password: hash })
                user.save()
            }
            const classInstance = await this.classModel.findByIdAndUpdate(id, { $push: { faculty: user._id } }, { returnOriginal: false }).populate("students").populate("faculty")

            return classInstance
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }

    async deleteFacultyFromClass(id: string, faculty: [string]) {
        try {
            const classInstance = await this.classModel.findByIdAndUpdate(id, { $pullAll: { faculty: faculty } }, { returnOriginal: false }).populate("students").populate("faculty")
            return classInstance
        } catch (error) {
            throw new ForbiddenException("Something went wrong while deleting faculty")
        }
    }

    async addNotes(id: string, files: Array<Express.Multer.File>) {
        return "let to come"
    }

    async deleteNotes(id: string) {
        const note = await this.notesModel.findByIdAndDelete(id)
        return note
    }

    async getNotesFromSubject(id: string) {
        const notes = await this.notesModel.find({ subject: id })
        return notes
    }

    async getAllNotes(user: string) {
        const classes = await this.classModel.findOne({ students: user })
        const subjects = await this.subjectModel.find({ class: classes })

        const notes = []
        for (let i = 0; i < subjects.length; i++) {
            const notesOfSubject = await this.notesModel.find({ subject: subjects[i] })
            notes.push(...notesOfSubject)
        }
        return notes
    }

    async addAssignment(id: string, files: Array<Express.Multer.File>, assignmentDTO: AssignmentDTO) {
        return assignmentDTO
    }

    async deleteAssignment(id: string) {
        const assignment = await this.assignmentModel.findByIdAndDelete(id)
        return assignment
    }

    async getAllAssignments(user: string) {
        const classes = await this.classModel.findOne({ students: user })
        const subjects = await this.subjectModel.find({ class: classes })

        const assignments = []
        for (let i = 0; i < subjects.length; i++) {
            const assignmentsOfSubject = await this.assignmentModel.find({ subject: subjects[i] })
            assignments.push(...assignmentsOfSubject)
        }
        return assignments
    }

    async createSubject(subjectDTO: SubjectDTO, classID: string) {
        const subject = new this.subjectModel({ faculty: subjectDTO.faculty, name: subjectDTO.name, university: subjectDTO.university, class: classID })
        await subject.save()
        return subject
    }

    async deleteSubject(subjectID: string) {
        const subject = await this.subjectModel.findByIdAndDelete(subjectID)
        return subject
    }

    async getSubjectsOfAClass(classID: string) {
        try {
            const subject = await this.subjectModel.find({ class: classID })
            return subject
        } catch (error) {
            throw new ForbiddenException("Something went wrong")            
        }
    }
}
