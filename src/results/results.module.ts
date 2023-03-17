import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { defineRolesSchema, rolesSchema } from 'src/administration/model';
import { authSchema } from 'src/authentication/model';
import { resultSchema, studentResultSchema } from './models';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Result', schema: resultSchema },
      { name: 'Student Mark', schema: studentResultSchema },
      { name: 'Auth', schema: authSchema },
      { name: 'Role', schema: rolesSchema },
      { name: 'Roles Definition', schema: defineRolesSchema },
    ]),
  ],
  controllers: [ResultsController],
  providers: [ResultsService]
})
export class ResultsModule {}
