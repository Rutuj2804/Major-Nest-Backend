import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { FeesDTo } from './dto';
import { AcceptedFeesInterface, FeesInterface } from './interface';
import { AssignRolesInterface } from 'src/administration/interface/roles.interface';
import { ClassInterface } from 'src/class/interface';

@Injectable()
export class FeesService {

    constructor(
        @InjectModel('Fee')
        private readonly feeModel: Model<FeesInterface>,
        @InjectModel('Accepted Fee')
        private readonly acceptedFeeModel: Model<AcceptedFeesInterface>,
        @InjectModel('Role')
        private readonly assignRoleModel: Model<AssignRolesInterface>,
        @InjectModel('Class') private readonly classModel: Model<ClassInterface>,
    ) { }

    async demandFees(classId: string, feesDTO: FeesDTo, user: AuthInterface) {
        let fees = new this.feeModel({ class: classId, university: feesDTO.university, title: feesDTO.title, amount: feesDTO.amount, user: user })
        fees.save()
        fees = await this.feeModel.findById(fees._id).populate("class").populate("university").populate("user")

        return fees
    }

    async getDemandFees(university: string, user: string) {
        const role = await (<any>(
            this.assignRoleModel
                .findOne({ user: user, university: university })
                .populate('roles')
        ));

        if (role.roles.name == 'ADMIN') {
            const fees = await this.feeModel.find({ university: university }).populate("class").populate("university").populate("user")
            return fees
        } else if(role.roles.name == 'FACULTY'){
            const classes = await this.classModel.find({ faculty: user })
            const fees = []
            for (let i = 0; i < classes.length; i++) {
                const s = await this.feeModel.find({ class: classes[i] }).populate("class").populate("university").populate("user")
                fees.push(s)
            }
            return fees
        } else {
            const classes = await this.classModel.find({ students: user })
            const fees = []
            for (let i = 0; i < classes.length; i++) {
                const s = await this.feeModel.find({ class: classes[i] }).populate("class").populate("university").populate("user")
                fees.push(s)
            }
            return fees
        }
    }

    async deleteDemandFees(classId: string) {
        let fees = await this.feeModel.findByIdAndDelete(classId).populate("class").populate("university").populate("user")
        return fees
    }

    async postAcceptedFees(feeId: string, user: AuthInterface) {
        const acceptedFee = new this.acceptedFeeModel({ user: user, fee: feeId })
        acceptedFee.save()
        return acceptedFee
    }
}
