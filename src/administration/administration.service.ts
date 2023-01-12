import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { AssignRolesDTO, DefineRolesDTO } from './dto';
import {
    AssignRolesInterface,
    DefineRolesInterface,
} from './interface/roles.interface';

@Injectable()
export class AdministrationService {
    constructor(
        @InjectModel('Roles Definition')
        private readonly defineRolesModel: Model<DefineRolesInterface>,
        @InjectModel('Role')
        private readonly assignRolesModel: Model<AssignRolesInterface>,
        @InjectModel("Auth") private readonly authModel: Model<AuthInterface>, 
    ) { }

    async defineRoles(defineRolesDTO: DefineRolesDTO) {
        const defineRole = new this.defineRolesModel({
            university: defineRolesDTO.university,
            name: defineRolesDTO.name.toUpperCase(),
            students: defineRolesDTO.students,
            faculty: defineRolesDTO.faculty,
            class: defineRolesDTO.class,
            subjects: defineRolesDTO.subjects,
            events: defineRolesDTO.events,
            utilities: defineRolesDTO.utilities,
            assignments: defineRolesDTO.assignments,
            roles: defineRolesDTO.roles,
        });
        await defineRole.save();
        return defineRole;
    }

    async updateDefinedRoles(defineRolesDTO: DefineRolesDTO, id: string) {
        try {
            await this.defineRolesModel.findByIdAndUpdate(id, {
                name: defineRolesDTO.name.toUpperCase(),
                students: defineRolesDTO.students,
                faculty: defineRolesDTO.faculty,
                class: defineRolesDTO.class,
                subjects: defineRolesDTO.subjects,
                events: defineRolesDTO.events,
                utilities: defineRolesDTO.utilities,
                assignments: defineRolesDTO.assignments,
                roles: defineRolesDTO.roles,
            });
            const defineRole = await this.defineRolesModel.findById(id);
            return defineRole;
        } catch (error) {
            throw new ForbiddenException('Something went wrong while updating role');
        }
    }

    async deleteDefinedRoles(id: string) {
        try {
            const roles = await this.assignRolesModel.find({ roles: id });

            if (roles.length)
                throw new ForbiddenException('This role is assigned to users');

            const defineRole = await this.defineRolesModel.findByIdAndDelete(id);
            return defineRole;
        } catch (error) {
            throw new ForbiddenException('Role not found');
        }
    }

    async getDefinedRoles(id: string) {
        try {
            const defineRole = await this.defineRolesModel.find({ university: id });
            return defineRole;
        } catch (error) {
            throw new ForbiddenException('University not found');
        }
    }

    async getMyRoleForUniversity(id: string, user: string) {
        try {
            const defineRole = await this.assignRolesModel
                .find({ university: id, user: user })
                .populate('roles');
            return defineRole;
        } catch (error) {
            throw new ForbiddenException('University not found');
        }
    }

    async assignRole(univeristyID: string, assignRolesDTO: AssignRolesDTO) {
        try {
            const user = await this.authModel.findOne({ email: assignRolesDTO.user })
            if(!user) throw new ForbiddenException("No user exists with the given email id")
            let role = await this.assignRolesModel.findOne({ user: user._id, university: univeristyID })
            if(!role) {
                role = new this.assignRolesModel({
                    user: user._id,
                    roles: assignRolesDTO.role,
                    university: univeristyID,
                });
                await role.save();
            }
            return role;
        } catch (error) {
            console.log(error);
            
            throw new ForbiddenException('Something went wrong while assigning role');
        }
    }

    async getAssignRolesData(univeristyID: string, user: string) {
        try {
            const role = await this.assignRolesModel.find({
                university: univeristyID,
            }).populate("roles").populate("user");
            return role;
        } catch (error) {
            throw new ForbiddenException('Something went wrong while assigning role');
        }
    }
}
