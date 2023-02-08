import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubmissionInterface } from './interface/submission.interface';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectModel('Submission')
        private readonly submissionModel: Model<SubmissionInterface>,
    ) { }

    async submitAssignment(user: string, id: string, file: Express.Multer.File) { 
        const prev = await this.submissionModel.find({ user: user, assignment: id })
        if(prev.length > 0) throw new ForbiddenException("Assignment already submitted")
        const submission = new this.submissionModel({ user: user, assignment: id, file: file.path })
        await submission.save()
        return { success: "Successfully uploaded assignment" }
    }

    async getSubmissionsByAssignmentId(id: string) {
        const submissions = await this.submissionModel.find({ assignment: id }).populate("user").populate("assignment")
        return submissions
    }
}
