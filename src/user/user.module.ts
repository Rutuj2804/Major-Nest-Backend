import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { universitySchema } from './model';

@Module({
  imports: [MongooseModule.forFeature([{ name: "University", schema: universitySchema }])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
