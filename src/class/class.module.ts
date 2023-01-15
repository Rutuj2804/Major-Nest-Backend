import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { assignmentSchema, classSchema, notesSchema, subjectSchema } from './model';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { defineRolesSchema, rolesSchema } from 'src/administration/model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Class', schema: classSchema },
      { name: 'Note', schema: notesSchema },
      { name: 'Assignment', schema: assignmentSchema },
      { name: 'Subject', schema: subjectSchema },
      { name: 'Role', schema: rolesSchema },
      { name: 'Roles Definition', schema: defineRolesSchema },
    ]),
    AuthenticationModule,
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [
    MongooseModule.forFeature([
      { name: 'Class', schema: classSchema },
    ])
  ]
})
export class ClassModule { }
