import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authSchema } from 'src/authentication/model';
import { AdministrationController } from './administration.controller';
import { AdministrationService } from './administration.service';
import { defineRolesSchema, rolesSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Role', schema: rolesSchema },
      { name: 'Roles Definition', schema: defineRolesSchema },
      { name: 'Auth', schema: authSchema }
    ]),
  ],
  controllers: [AdministrationController],
  providers: [AdministrationService],
})
export class AdministrationModule { }
