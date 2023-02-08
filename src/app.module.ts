import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AdministrationModule } from './administration/administration.module';
import { FacultyModule } from './faculty/faculty.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ClassModule } from './class/class.module';
import { MulterModule } from '@nestjs/platform-express';
import { MessagingModule } from './messaging/messaging.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LectureModule } from './lecture/lecture.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload')
    }),
    AuthenticationModule, 
    AdministrationModule, 
    FacultyModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot("mongodb+srv://rutuj:rutuj@cluster0.1mbuvl3.mongodb.net/development?retryWrites=true&w=majority"),
    UserModule,
    ClassModule,
    MessagingModule,
    AssignmentsModule,
    LectureModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
