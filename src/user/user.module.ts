import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { universitySchema } from './model';
import { classSchema } from 'src/class/model';
import { defineRolesSchema, rolesSchema } from 'src/administration/model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'University', schema: universitySchema },
      { name: 'Class', schema: classSchema },
      { name: 'Role', schema: rolesSchema },
      { name: 'Roles Definition', schema: defineRolesSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
