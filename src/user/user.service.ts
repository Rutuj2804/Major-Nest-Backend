import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDTO } from 'src/authentication/dto';
import { UniversityDTO } from './dto';
import { UniversityInterface } from './interface';

@Injectable()
export class UserService {

    constructor(@InjectModel("University") private readonly universityModel: Model<UniversityInterface>) {}

    async createUniveristy(universityDTO: UniversityDTO, user: AuthDTO) {
        const university = new this.universityModel({ name: universityDTO.name, user: user })
        await university.save()
        return university
    }

    async updateUniversity(id: string, universityDTO: UniversityDTO) {
        try {
            let university = await this.universityModel.findByIdAndUpdate(id, universityDTO)
            university = await this.universityModel.findById(id)
            return university
        } catch (error) {
            throw new ForbiddenException("University not found")
        }
    }

    async getUniversity(id: string) {
        try {
            const university = await this.universityModel.findById(id)
            return university
        } catch (error) {
            throw new ForbiddenException("University not found")
        }
    }

    async getAllUniversities(id: string) {
        try {
            const university = await this.universityModel.find({ user: id })
            return university
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }
}
