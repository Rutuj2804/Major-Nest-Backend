import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignRolesInterface } from 'src/administration/interface/roles.interface';
import {
    AssignmentInterface,
    ClassInterface,
    NotesInterface,
    SubjectInterface,
} from 'src/class/interface';
import { EventsInterface } from 'src/events/interface';
import { LectureInterface } from 'src/lecture/interface';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel('Class') private readonly classModel: Model<ClassInterface>,
        @InjectModel('Note') private readonly notesModel: Model<NotesInterface>,
        @InjectModel('Assignment')
        private readonly assignmentModel: Model<AssignmentInterface>,
        @InjectModel('Role')
        private readonly assignRoleModel: Model<AssignRolesInterface>,
        @InjectModel('Event')
        private readonly eventsModel: Model<EventsInterface>,
        @InjectModel('Lecture')
        private readonly lectureModel: Model<LectureInterface>,
        @InjectModel('Subject')
        private readonly subjectModel: Model<SubjectInterface>,
    ) { }

    async getCardsData(user: string, university: string) {
        const role = await (<any>(
            this.assignRoleModel
                .findOne({ user: user, university: university })
                .populate('roles')
        ));
        if (role.roles.name == 'STUDENT') {
            const classJoined = await this.classModel.findOne({ students: user });
            const notes = await this.notesModel
                .find({ class: classJoined._id })
                .countDocuments();
            const faculties = classJoined.faculty.length;
            const events = await this.eventsModel
                .find({ university: university })
                .countDocuments();
            const lectures = await this.lectureModel.find({
                classID: classJoined._id,
            });

            return [
                {
                    name: 'Notes',
                    count: notes,
                },
                {
                    name: 'Faculties',
                    count: faculties,
                },
                {
                    name: 'Lectures',
                    count: lectures.length,
                },
                {
                    name: 'Events',
                    count: events,
                },
            ];
        } else if (role.roles.name == 'FACULTY') {
            const classJoined = await this.classModel.find({ faculty: user });

            let notes = 0;
            for (let i = 0; i < classJoined.length; i++) {
                const note = await this.notesModel
                    .find({ class: classJoined[0]._id })
                    .countDocuments();
                notes += note;
            }
            const events = await this.eventsModel
                .find({ university: university })
                .countDocuments();

            let lectures = 0;
            for (let i = 0; i < classJoined.length; i++) {
                const lecture = await this.lectureModel
                    .find({ classID: classJoined[i]._id })
                    .countDocuments();
                lectures += lecture;
            }

            return [
                {
                    name: 'Notes',
                    count: notes,
                },
                {
                    name: 'Classes',
                    count: classJoined.length,
                },
                {
                    name: 'Lectures',
                    count: lectures,
                },
                {
                    name: 'Events',
                    count: events,
                },
            ];
        } else {
            const classJoined = await this.classModel.find({
                university: university,
            });

            let students = 0;
            for (let i = 0; i < classJoined.length; i++) {
                const note = classJoined[i].students.length;
                students += note;
            }
            const events = await this.eventsModel
                .find({ university: university })
                .countDocuments();

            let faculties = 0;
            for (let i = 0; i < classJoined.length; i++) {
                const faculty = classJoined[i].faculty.length;
                faculties += faculty;
            }

            return [
                {
                    name: 'Students',
                    count: students,
                },
                {
                    name: 'Faculties',
                    count: faculties,
                },
                {
                    name: 'Classes',
                    count: classJoined.length,
                },
                {
                    name: 'Events',
                    count: events,
                },
            ];
        }
    }

    async getLineChartData(user: string, university: string) {
        const role = await (<any>(
            this.assignRoleModel
                .findOne({ user: user, university: university })
                .populate('roles')
        ));
        if (role.roles.name == 'STUDENT') {

            const eventsGroup = await this.eventsModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])

            const lecturesGroup = await this.lectureModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])

            const assignmentsGroup = await this.assignmentModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])
            return [
                { 
                    id: "Events",
                    data: eventsGroup,
                    color: "hsl(329, 70%, 50%)"
                },
                { 
                    id: "Lectures",
                    data: lecturesGroup,
                    color: "hsl(347, 70%, 50%)"
                },
                { 
                    id: "Assignments",
                    data: assignmentsGroup,
                    color: "hsl(228, 70%, 50%)"
                },
            ]
        } else if (role.roles.name == 'FACULTY') {

            const eventsGroup = await this.eventsModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])

            const lecturesGroup = await this.lectureModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])

            const assignmentsGroup = await this.assignmentModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])
            return [
                { 
                    id: "Events",
                    data: eventsGroup,
                    color: "hsl(329, 70%, 50%)"
                },
                { 
                    id: "Lectures",
                    data: lecturesGroup,
                    color: "hsl(347, 70%, 50%)"
                },
                { 
                    id: "Assignments",
                    data: assignmentsGroup,
                    color: "hsl(228, 70%, 50%)"
                },
            ]
        } else {
            const classesGroup = await this.classModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])

            const eventsGroup = await this.eventsModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])

            const lecturesGroup = await this.lectureModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } },
            }}])

            const assignmentsGroup = await this.assignmentModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                y: { $sum: 1 },
                x: { $first: { $dateToString: { date: "$createdAt", format: "%Y-%m" } } }
            }}])
            
            return [
                { 
                    id: "Classes",
                    data: classesGroup,
                    color: "hsl(98, 70%, 50%)",
                },
                { 
                    id: "Events",
                    data: eventsGroup,
                    color: "hsl(329, 70%, 50%)"
                },
                { 
                    id: "Lectures",
                    data: lecturesGroup,
                    color: "hsl(347, 70%, 50%)"
                },
                { 
                    id: "Assignments",
                    data: assignmentsGroup,
                    color: "hsl(228, 70%, 50%)"
                },
            ]
        }
    }

    async getBarChartData(user: string, university: string) {

        const role = await (<any>(
            this.assignRoleModel
                .findOne({ user: user, university: university })
                .populate('roles')
        ));

        if (role.roles.name == 'STUDENT') {
            const lecturesGroup = await this.lectureModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                lecture: { $sum: 1 },
                lectureColor: {$first: "hsl(120, 70%, 50%)"},
            }}])
            return lecturesGroup

        } else if (role.roles.name == 'FACULTY') {
            const lecturesGroup = await this.lectureModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                lecture: { $sum: 1 },
                lectureColor: {$first: "hsl(120, 70%, 50%)"},
            }}])
            return lecturesGroup

        } else {
            const lecturesGroup = await this.lectureModel.aggregate([{ $group: {
                _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
                lecture: { $sum: 1 },
                lectureColor: {$first: "hsl(120, 70%, 50%)"},
            }}])
            return lecturesGroup

        }
    }

    async getPieChartData(user: string, university: string) {
        const role = await (<any>(
            this.assignRoleModel
                .findOne({ user: user, university: university })
                .populate('roles')
        ));
        if (role.roles.name == 'STUDENT') {

            const classes = await this.classModel.find({ students: user })

            let facultyCount = 0
            for (let i = 0; i < classes.length; i++) {
                facultyCount += classes[i].faculty.length
            }

            let notesCount = 0
            for (let i = 0; i < classes.length; i++) {
                const notes = await this.notesModel.find({ class: classes[i]._id }).countDocuments()
                notesCount += notes
            }
            
            return [
                {
                    id: "Utilities",
                    label: "Utilities",
                    value: notesCount,
                    color: "hsl(233, 70%, 50%)"
                },
                {
                    id: "Faculties",
                    label: "Faculties",
                    value: facultyCount,
                    color: "hsl(329, 70%, 50%)"
                },
                {
                    id: "Classes",
                    label: "Classes",
                    value: classes.length,
                    color: "hsl(207, 70%, 50%)"
                },
            ]

        } else if (role.roles.name == 'FACULTY') {

            const classes = await this.classModel.find({ faculty: user })

            let facultyCount = 0
            for (let i = 0; i < classes.length; i++) {
                facultyCount += classes[i].faculty.length
            }

            let studentCount = 0
            for (let i = 0; i < classes.length; i++) {
                studentCount += classes[i].students.length
            }

            return [
                {
                    id: "Students",
                    label: "Students",
                    value: studentCount,
                    color: "hsl(233, 70%, 50%)"
                },
                {
                    id: "Faculties",
                    label: "Faculties",
                    value: facultyCount,
                    color: "hsl(329, 70%, 50%)"
                },
                {
                    id: "Classes",
                    label: "Classes",
                    value: classes.length,
                    color: "hsl(207, 70%, 50%)"
                },
            ]

        } else {
            const classes = await this.classModel.find({ university: university })

            let facultyCount = 0
            for (let i = 0; i < classes.length; i++) {
                facultyCount += classes[i].faculty.length
            }

            let studentCount = 0
            for (let i = 0; i < classes.length; i++) {
                studentCount += classes[i].students.length
            }
            return [
                {
                    id: "Students",
                    label: "Students",
                    value: studentCount,
                    color: "hsl(233, 70%, 50%)"
                },
                {
                    id: "Faculties",
                    label: "Faculties",
                    value: facultyCount,
                    color: "hsl(329, 70%, 50%)"
                },
                {
                    id: "Classes",
                    label: "Classes",
                    value: classes.length,
                    color: "hsl(207, 70%, 50%)"
                },
            ]
        }
    }

    async getClassesChartData(user: string, university: string) {
        const role = await (<any>(
            this.assignRoleModel
                .findOne({ user: user, university: university })
                .populate('roles')
        ));
        if (role.roles.name == 'STUDENT') {

            const classes = await this.classModel.findOne({ students: user })

            const subjects = await this.subjectModel.find({ class: classes._id }).populate("class")

            return { role: "STUDENT", data: subjects}

        } else if (role.roles.name == 'FACULTY') {

            const classes = await this.classModel.find({ faculty: user })

            return { role: "FACULTY", data: classes}

        } else {
            const classes = await this.classModel.find({ university: university })

            return { role: "ANY", data: classes}
        }
    }
}
