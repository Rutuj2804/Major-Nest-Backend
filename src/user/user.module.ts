import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { universitySchema } from './model';
import { classSchema } from 'src/class/model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'University', schema: universitySchema },
      { name: 'Class', schema: classSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
