import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { attendenceSchema } from './models';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Attendence', schema: attendenceSchema }])],
  providers: [AttendenceService],
  controllers: [AttendenceController]
})
export class AttendenceModule {}
