import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { rolesSchema } from 'src/administration/model';
import { assignmentSchema, classSchema, notesSchema, subjectSchema } from 'src/class/model';
import { eventSchema } from 'src/events/models';
import { lectureSchema } from 'src/lecture/model';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Class', schema: classSchema },
      { name: 'Note', schema: notesSchema },
      { name: 'Assignment', schema: assignmentSchema },
      { name: 'Role', schema: rolesSchema },
      { name: 'Event', schema: eventSchema },
      { name: 'Lecture', schema: lectureSchema },
      { name: 'Subject', schema: subjectSchema },
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
