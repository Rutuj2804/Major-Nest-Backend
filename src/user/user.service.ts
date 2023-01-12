import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDTO } from 'src/authentication/dto';
import { ClassInterface } from 'src/class/interface';
import { UniversityDTO } from './dto';
import { UniversityInterface } from './interface';

@Injectable()
export class UserService {

    constructor(@InjectModel("University") private readonly universityModel: Model<UniversityInterface>, @InjectModel("Class") private readonly classModel: Model<ClassInterface>) {}

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
            const classes = await this.classModel.find({ $or: [{ faculty: id }, { students: id }] })
            let university = []
            for (let i = 0; i < classes.length; i++) {
                university.push(classes[i].university)
            }
            const u = await this.universityModel.find({ user: id}, { _id: 1 })
            for (let i = 0; i < u.length; i++) {
                if(!university.indexOf(u[i]._id)) university.push(u[i]._id)
            }
            
            const unique = university
            
            university = []

            for (let i = 0; i < unique.length; i++) {
                const u = await this.universityModel.findById(unique[i])
                university.push(u)
            }

            return university
        } catch (error) {
            throw new ForbiddenException("Something went wrong")
        }
    }
}
