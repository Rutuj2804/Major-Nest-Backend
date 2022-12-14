import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignRolesDTO, DefineRolesDTO } from './dto';
import { AssignRolesInterface, DefineRolesInterface } from './interface/roles.interface';

@Injectable()
export class AdministrationService {

    constructor(@InjectModel("Roles Definition") private readonly defineRolesModel: Model<DefineRolesInterface>, @InjectModel("Role") private readonly assignRolesModel: Model<AssignRolesInterface>) {}

    async defineRoles(defineRolesDTO: DefineRolesDTO) {
        const defineRole = new this.defineRolesModel({ university: defineRolesDTO.university, name: defineRolesDTO.name.toUpperCase(), students: defineRolesDTO.students, faculty: defineRolesDTO.faculty })
        await defineRole.save()
        return defineRole
    }

    async updateDefinedRoles(defineRolesDTO: DefineRolesDTO, id: string) {
        try {
            await this.defineRolesModel.findByIdAndUpdate(id, { university: id, name: defineRolesDTO.name.toUpperCase(), students: defineRolesDTO.students, faculty: defineRolesDTO.faculty })            
            const defineRole = await this.defineRolesModel.findById(id)
            return defineRole
        } catch (error) {
            throw new ForbiddenException("Something went wrong while updating role")
        }
    }

    async deleteDefinedRoles(id: string) {
        try {

            const roles = await this.assignRolesModel.find({ roles:id })
            
            if(roles.length) throw new ForbiddenException("This role is assigned to users")

            const defineRole = await this.defineRolesModel.findByIdAndDelete(id)
            return defineRole
        } catch (error) {
            throw new ForbiddenException("Role not found")
        }
    }

    async getDefinedRoles(id: string) {
        try {
            const defineRole = await this.defineRolesModel.find({ university: id })
            return defineRole
        } catch (error) {
            throw new ForbiddenException("University not found")            
        }
    }

    async assignRole(univeristyID:string, assignRolesDTO: AssignRolesDTO) {
        try {
            const role = new this.assignRolesModel({ user: assignRolesDTO.user, roles: [assignRolesDTO.role], university: univeristyID })
            await role.save()
            return role
        } catch (error) {
            throw new ForbiddenException("Something went wrong while assigning role")
        }
    }
}
