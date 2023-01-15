import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignRolesInterface, DefineRolesInterface } from 'src/administration/interface/roles.interface';
import { AuthDTO } from 'src/authentication/dto';
import { ClassInterface } from 'src/class/interface';
import { UniversityDTO } from './dto';
import { UniversityInterface } from './interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('University')
        private readonly universityModel: Model<UniversityInterface>,
        @InjectModel('Class') private readonly classModel: Model<ClassInterface>,
        @InjectModel('Roles Definition')
        private readonly defineRolesModel: Model<DefineRolesInterface>,
        @InjectModel('Role')
        private readonly assignRolesModel: Model<AssignRolesInterface>,
    ) { }

    async createUniveristy(universityDTO: UniversityDTO, user: AuthDTO) {
        const university = new this.universityModel({
            name: universityDTO.name,
            user: user,
        });
        const admin = new this.defineRolesModel({ university: university._id, name: "ADMIN", students: 1, faculty: 1, class: 2, subjects: 0, events: 0, utilities: 0, assignments: 0, roles: 1 })
        const faculty = new this.defineRolesModel({ university: university._id, name: "FACULTY", students: 1, faculty: 2, class: 0, subjects: 0, events: 0, utilities: 1, assignments: 1, roles: 2 })
        const student = new this.defineRolesModel({ university: university._id, name: "STUDENT", students: 2, faculty: 2, class: 2, subjects: 0, events: 0, utilities: 0, assignments: 0, roles: 1 })

        await admin.save()
        await faculty.save()
        await student.save()
        await university.save();

        const defineAdmin = new this.assignRolesModel({ user: user, university: university._id, roles: admin._id })
        await defineAdmin.save()
        return university;
    }

    async updateUniversity(id: string, universityDTO: UniversityDTO) {
        try {
            let university = await this.universityModel.findByIdAndUpdate(
                id,
                universityDTO,
            );
            university = await this.universityModel.findById(id);
            return university;
        } catch (error) {
            throw new ForbiddenException('University not found');
        }
    }

    async getUniversity(id: string) {
        try {
            const university = await this.universityModel.findById(id);
            return university;
        } catch (error) {
            throw new ForbiddenException('University not found');
        }
    }

    async getAllUniversities(id: string) {
        // try {
            const classes = await this.classModel.find({
                $or: [{ faculty: id }, { students: id }],
            });
            let university = [];
            for (let i = 0; i < classes.length; i++) {
                university.push(classes[i].university);
            }
            const u = await this.universityModel.find({ user: id }, { _id: 1 });
            
            for (let i = 0; i < u.length; i++) {
                if (university.indexOf(u[i]._id) === -1) university.push(u[i]._id);
            }

            const unique = university;

            university = [];

            for (let i = 0; i < unique.length; i++) {
                const u = await this.universityModel.findById(unique[i]);
                university.push(u);
            }

            return university;
        // } catch (error) {
        //     throw new ForbiddenException('Something went wrong');
        // }
    }
}
