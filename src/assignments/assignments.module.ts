import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { assignmentSchema } from 'src/class/model';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { submissionSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Assignment', schema: assignmentSchema },
      { name: 'Submission', schema: submissionSchema },
    ]),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule { }
