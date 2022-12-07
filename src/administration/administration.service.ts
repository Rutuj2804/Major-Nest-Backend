import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefineRolesDTO } from './dto';
import { DefineRolesInterface } from './interface/roles.interface';

@Injectable()
export class AdministrationService {

    constructor(@InjectModel("Roles Definition") private readonly defineRolesModel: Model<DefineRolesInterface>) {}

    async defineRoles(defineRolesDTO: DefineRolesDTO) {
        const defineRole = new this.defineRolesModel({ university: defineRolesDTO.university, name: defineRolesDTO.name.toUpperCase(), students: defineRolesDTO.students, faculty: defineRolesDTO.faculty })
        await defineRole.save()
        return defineRole
    }

    async updateDefinedRoles(defineRolesDTO: DefineRolesDTO, id: string) {
        await this.defineRolesModel.findByIdAndUpdate(id, { university: id, name: defineRolesDTO.name.toUpperCase(), students: defineRolesDTO.students, faculty: defineRolesDTO.faculty })
        const defineRole = await this.defineRolesModel.findById(id)
        return defineRole
    }

    async deleteDefinedRoles(id: string) {
        const defineRole = await this.defineRolesModel.findByIdAndDelete(id)
        return defineRole
    }

    async getDefinedRoles(id: string) {
        const defineRole = await this.defineRolesModel.find({ university: id })
        return defineRole
    }
}
