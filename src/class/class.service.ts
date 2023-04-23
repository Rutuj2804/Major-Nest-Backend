import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { AssignmentDTO, ClassDTO, ManulStudentAddDTO, SubjectDTO } from './dto';
import * as argon from 'argon2';
import {
    AssignmentInterface,
    ClassInterface,
    NotesInterface,
    SubjectInterface,
} from './interface';
import {
    AssignRolesInterface,
    DefineRolesInterface,
} from 'src/administration/interface/roles.interface';

@Injectable()
export class ClassService {
    constructor(
        @InjectModel('Class') private readonly classModel: Model<ClassInterface>,
        @InjectModel('Auth') private readonly authModel: Model<AuthInterface>,
        @InjectModel('Note') private readonly notesModel: Model<NotesInterface>,
        @InjectModel('Assignment')
        private readonly assignmentModel: Model<AssignmentInterface>,
        @InjectModel('Subject')
        private readonly subjectModel: Model<SubjectInterface>,
        @InjectModel('Role')
        private readonly assignRoleModel: Model<AssignRolesInterface>,
        @InjectModel('Roles Definition')
        private readonly defineRoleModel: Model<DefineRolesInterface>,
    ) { }

    async createClass(classDTO: ClassDTO) {
        const classInstance = new this.classModel(classDTO);
        await classInstance.save();
        return classInstance;
    }

    async updateClass(classDTO: ClassDTO, id: string) {
        const classInstance = await this.classModel.findByIdAndUpdate(id, classDTO);
        return classInstance;
    }

    async deleteClass(id: string) {
        const classInstance = await this.classModel.findByIdAndDelete(id);
        return classInstance;
    }

    async deleteClasses(arr: [string]) {
        for (let i = 0; i < arr.length; i++) {
            await this.classModel.findByIdAndDelete(arr[i]);
        }
        return { success: 'Successfully deleted classes' };
    }

    async getAllClasses(id: string) {
        try {
            const classes = await this.classModel.find({ university: id });
            return classes;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async getClassByID(id: string) {
        try {
            const classes = await this.classModel.findById(id);
            return classes;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async getMyClasses(id: string, user: string) {
        try {
            const classes = await this.classModel.find({
                university: id,
                faculty: user,
            });
            return classes;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async getMySubjects(user: string) {
        try {
            const subs = [];
            const classID = await this.classModel.find({
                $or: [{ students: user }, { faculty: user }],
            });

            for (let i = 0; i < classID.length; i++) {
                const subjects = await this.subjectModel.find({ class: classID[i] }).populate("class");
                subs.push(...subjects);
            }
            return subs;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async getAllSubjects(id: string) {
        try {
            const subs = [];
            const classID = await this.classModel.find({ university: id });

            for (let i = 0; i < classID.length; i++) {
                const subjects = await this.subjectModel
                    .find({ class: classID[i] })
                    .populate('class');
                subs.push(...subjects);
            }
            return subs;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async addStudents(id: string, file: Express.Multer.File) {
        const classExist = await this.classModel.findById(id);

        if (!classExist) throw new ForbiddenException('Class does not exist');

        let array = file.buffer.toString().split('\r');

        array = array.filter((a) => a != '\n');

        const headers = array[0].toLowerCase().split(',');

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

        const studentsID = [];

        const studentRole = await this.defineRoleModel.findOne({
            university: classExist.university,
            name: 'STUDENT',
        });

        if (!studentRole) throw new ForbiddenException('No STUDENT role found');

        for (let i = 0; i < students.length; i++) {
            let user = await this.authModel.findOne({ email: students[i].email });
            if (!user) {
                const hash = await argon.hash(students[i].email);
                user = new this.authModel({ email: students[i].email, password: hash });
                user.save();
                const assignRoleToStudent = new this.assignRoleModel({
                    user: user._id,
                    roles: studentRole._id,
                    university: classExist.university,
                });
                assignRoleToStudent.save();
            }
            studentsID.push(user._id);
        }

        let newClass = await this.classModel
            .findByIdAndUpdate(
                id,
                { students: studentsID },
                { returnOriginal: false },
            )
            .populate('students')
            .populate('faculty');
        return newClass;
    }

    async addStudentManual(id: string, manulStudentAddDTO: ManulStudentAddDTO) {
        try {
            let user = await this.authModel.findOne({
                email: manulStudentAddDTO.email,
            });
            if (!user) {
                const hash = await argon.hash(manulStudentAddDTO.email);
                user = new this.authModel({
                    email: manulStudentAddDTO.email,
                    password: hash,
                });
                user.save();
            }
            const classInstance = await this.classModel
                .findByIdAndUpdate(
                    id,
                    { $push: { students: user._id } },
                    { returnOriginal: false },
                )
                .populate('students')
                .populate('faculty');

            const studentRole = await this.defineRoleModel.findOne({
                university: classInstance.university,
                name: 'STUDENT',
            });

            if (!studentRole) throw new ForbiddenException('No STUDENT role found');

            const assignRoleToStudent = new this.assignRoleModel({
                user: user._id,
                roles: studentRole._id,
                university: classInstance.university,
            });
            assignRoleToStudent.save();

            return classInstance;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async deleteStudentsFromClass(id: string, students: [string]) {
        try {
            const classInstance = await this.classModel
                .findByIdAndUpdate(
                    id,
                    { $pullAll: { students: students } },
                    { returnOriginal: false },
                )
                .populate('students')
                .populate('faculty');

            for (let i = 0; i < students.length; i++) {
                await this.assignRoleModel.findOneAndDelete({
                    university: classInstance.university,
                    user: students[i],
                });
            }

            return classInstance;
        } catch (error) {
            console.log(error);

            throw new ForbiddenException(
                'Something went wrong while deleting students',
            );
        }
    }

    async getAllStudents(id: string) {
        try {
            const res = await this.classModel
                .find({ university: id })
                .populate('students')
                .populate('faculty');
            return res;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async getStudentsOfFaculty(id: string, user: string) {
        try {
            const res = await this.classModel
                .find({ university: id, faculty: user })
                .populate('students')
                .populate('faculty');
            return res;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async addFaculty(id: string, file: Express.Multer.File) {
        const classExist = await this.classModel.findById(id);

        if (!classExist) throw new ForbiddenException('Class does not exist');

        let array = file.buffer.toString().split('\r');

        array = array.filter((a) => a != '\n');

        const headers = array[0].toLowerCase().split(',');

        const faculty = [];

        for (let i = 0; i < array.length - 1; i++) {
            let obj = {};
            let data = array[i + 1].split(',');

            data = data.filter((a) => a != '');

            if (data.length !== headers.length)
                throw new ForbiddenException(
                    `Null values not accepted!!. ${faculty.length} faculty added`,
                );

            for (let j = 0; j < headers.length; j++) {
                obj[`${headers[j]}`] = data[j].replace(/[\r\n]/gm, '');
            }
            faculty.push(obj);
        }

        const facultyID = [];

        const facultyRole = await this.defineRoleModel.findOne({
            university: classExist.university,
            name: 'FACULTY',
        });

        if (!facultyRole) throw new ForbiddenException('No FACULTY role found');

        for (let i = 0; i < faculty.length; i++) {
            let user = await this.authModel.findOne({ email: faculty[i].email });
            if (!user) {
                const hash = await argon.hash(faculty[i].email);
                user = new this.authModel({ email: faculty[i].email, password: hash });
                user.save();

                const assignRoleToFaculty = new this.assignRoleModel({
                    user: user._id,
                    roles: facultyRole._id,
                    university: classExist.university,
                });
                assignRoleToFaculty.save();
            }
            facultyID.push(user._id);
        }

        let newClass = await this.classModel.findByIdAndUpdate(id, {
            faculty: facultyID,
        });

        newClass = await this.classModel.findById(id);
        return newClass;
    }

    async addFacultyManual(id: string, manulStudentAddDTO: ManulStudentAddDTO) {
        try {
            let user = await this.authModel.findOne({
                email: manulStudentAddDTO.email,
            });
            if (!user) {
                const hash = await argon.hash(manulStudentAddDTO.email);
                user = new this.authModel({
                    email: manulStudentAddDTO.email,
                    password: hash,
                });
                user.save();
            }
            const classInstance = await this.classModel
                .findByIdAndUpdate(
                    id,
                    { $push: { faculty: user._id } },
                    { returnOriginal: false },
                )
                .populate('students')
                .populate('faculty');

            const facultyRole = await this.defineRoleModel.findOne({
                university: classInstance.university,
                name: 'FACULTY',
            });

            if (!facultyRole) throw new ForbiddenException('No FACULTY role found');

            const assignRoleToFaculty = new this.assignRoleModel({
                user: user._id,
                roles: facultyRole._id,
                university: classInstance.university,
            });
            assignRoleToFaculty.save();

            return classInstance;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }

    async deleteFacultyFromClass(id: string, faculty: [string]) {
        try {
            const classInstance = await this.classModel
                .findByIdAndUpdate(
                    id,
                    { $pullAll: { faculty: faculty } },
                    { returnOriginal: false },
                )
                .populate('students')
                .populate('faculty');

            for (let i = 0; i < faculty.length; i++) {
                await this.assignRoleModel.findOneAndDelete({
                    university: classInstance.university,
                    user: faculty[i],
                });
            }

            return classInstance;
        } catch (error) {
            throw new ForbiddenException(
                'Something went wrong while deleting faculty',
            );
        }
    }

    async addNotes(
        id: string,
        subjectId: string,
        files: Array<Express.Multer.File>,
        user: string,
    ) {
        const filesUploaded = [];
        for (let i = 0; i < files.length; i++) {
            const file = new this.notesModel({
                class: id,
                subject: subjectId,
                user: user,
                file: files[i].path,
            });
            await file.save();
            const nFile = await this.notesModel
                .findById(file._id)
                .populate('subject')
                .populate('class')
                .populate('user');
            filesUploaded.push(nFile);
        }
        return filesUploaded;
    }

    async deleteNotes(id: [string]) {
        for (let i = 0; i < id.length; i++) {
            await this.notesModel.findByIdAndDelete(id);
        }
        return id;
    }

    async getNotesFromSubject(id: string) {
        const notes = await this.notesModel.find({ subject: id });
        return notes;
    }

    async getAllNotes(user: string) {
        const classes = await this.classModel.find({
            $or: [{ students: user }, { faculty: user }],
        });

        const subs = [];

        for (let i = 0; i < classes.length; i++) {
            const subjects = await this.subjectModel.find({ class: classes[i] });
            subs.push(...subjects);
        }

        const notes = [];
        for (let i = 0; i < subs.length; i++) {
            const notesOfSubject = await this.notesModel
                .find({
                    subject: subs[i],
                })
                .populate('subject')
                .populate('class')
                .populate('user');
            notes.push(...notesOfSubject);
        }
        return notes;
    }

    async addAssignment(
        id: string,
        subjectId: string,
        files: Array<Express.Multer.File>,
        assignmentDTO: AssignmentDTO,
        user: AuthInterface,
    ) {
        const filesUploaded = [];
        for (let i = 0; i < files.length; i++) {
            const file = new this.assignmentModel({
                class: id,
                subject: subjectId,
                user: user,
                file: files[i].path,
                title: assignmentDTO.title,
                description: assignmentDTO.description,
                submission: assignmentDTO.submission,
            });
            await file.save();
            const nFile = await this.assignmentModel
                .findById(file._id)
                .populate('subject')
                .populate('class')
                .populate('user');
            filesUploaded.push(nFile);
        }
        return filesUploaded;
    }

    async deleteAssignment(id: [string]) {
        for (let i = 0; i < id.length; i++) {
            await this.assignmentModel.findByIdAndDelete(id[i]);
        }
        return id;
    }

    async getAllAssignments(user: string) {
        const classes = await this.classModel.find({
            $or: [{ students: user }, { faculty: user }],
        });

        const subs = [];
        for (let i = 0; i < classes.length; i++) {
            const subjects = await this.subjectModel.find({ class: classes });
            subs.push(...subjects);
        }

        const assignments = [];
        for (let i = 0; i < subs.length; i++) {
            const assignmentsOfSubject = await this.assignmentModel
                .find({
                    subject: subs[i],
                })
                .populate('subject')
                .populate('class')
                .populate('user');
            assignments.push(...assignmentsOfSubject);
        }
        return assignments;
    }

    async createSubject(subjectDTO: SubjectDTO, classID: string) {
        const subject = new this.subjectModel({
            faculty: subjectDTO.faculty,
            name: subjectDTO.name,
            class: classID,
        });
        await subject.save();
        const res = await this.subjectModel.findById(subject._id).populate('class');
        return res;
    }

    async deleteSubject(subjectID: string) {
        const subject = await this.subjectModel.findByIdAndDelete(subjectID);
        return subject;
    }

    async deleteBulkSubject(subjectID: [string]) {
        const subs = [];
        for (let i = 0; i < subjectID.length; i++) {
            const subject = await this.subjectModel.findByIdAndDelete(subjectID[i]);
            subs.push(subject._id);
        }
        return subs;
    }

    async getSubjectsOfAClass(classID: string) {
        try {
            const subject = await this.subjectModel.find({ class: classID }).populate("class");
            return subject;
        } catch (error) {
            throw new ForbiddenException('Something went wrong');
        }
    }
}
