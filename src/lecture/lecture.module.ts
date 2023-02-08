import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { lectureSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lecture', schema: lectureSchema },
    ]),
  ],
  providers: [LectureService],
  controllers: [LectureController]
})
export class LectureModule { }
