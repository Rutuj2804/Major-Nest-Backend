import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { classSchema } from './model';

@Module({
  imports: [MongooseModule.forFeature([{ name :"Class", schema: classSchema }])],
  providers: [ClassService],
  controllers: [ClassController]
})
export class ClassModule {}
