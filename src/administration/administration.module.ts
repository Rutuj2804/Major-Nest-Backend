import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdministrationController } from './administration.controller';
import { AdministrationService } from './administration.service';
import { defineRolesSchema, rolesSchema } from './model';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Role", schema: rolesSchema }, { name: "Roles Definition", schema: defineRolesSchema }])],
  controllers: [AdministrationController],
  providers: [AdministrationService]
})
export class AdministrationModule {}
