import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { classSchema } from './model';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [MongooseModule.forFeature([{ name :"Class", schema: classSchema }]), AuthenticationModule],
  providers: [ClassService],
  controllers: [ClassController]
})
export class ClassModule {}
