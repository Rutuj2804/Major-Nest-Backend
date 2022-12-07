import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AdministrationModule } from './administration/administration.module';
import { FacultyModule } from './faculty/faculty.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthenticationModule, 
    AdministrationModule, 
    FacultyModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot("mongodb+srv://rutuj:rutuj@cluster0.1mbuvl3.mongodb.net/development?retryWrites=true&w=majority"),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
