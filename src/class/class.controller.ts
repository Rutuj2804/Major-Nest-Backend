import {
    Controller,
    Post,
    Body,
    Delete,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/authentication/guard';
import { ClassService } from './class.service';
import { AssignmentDTO, ClassDTO, SubjectDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('class')
export class ClassController {
    constructor(private classService: ClassService) { }

    @Post('create')
    createClass(@Body() classDTO: ClassDTO) {
        return this.classService.createClass(classDTO);
    }

    @Delete(':id')
    deleteClass(@Param('id') id: string) {
        return this.classService.deleteClass(id);
    }

    @Post('add_students/:id')
    @UseInterceptors(FileInterceptor('file'))
    addStudents(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.classService.addStudents(id, file);
    }

    @Post('add_faculty/:id')
    @UseInterceptors(FileInterceptor('file'))
    addFaculty(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.classService.addFaculty(id, file);
    }

    @Post('add_notes/:id')
    @UseInterceptors(FilesInterceptor('files'))
    addNotesToClass(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        return this.classService.addNotes(id, files);
    }

    @Delete('add_notes/:id')
    deleteNotesFromClass(
        @Param('id') id: string,
    ) {
        return this.classService.deleteNotes(id);
    }

    @Post('add_notes/:id')
    @UseInterceptors(FilesInterceptor('files'))
    addAssignmentToClass(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() assignmentDTO:AssignmentDTO
    ) {
        return this.classService.addAssignment(id, files, assignmentDTO);
    }

    @Delete('add_notes/:id')
    deleteAssignmentFromClass(
        @Param('id') id: string,
    ) {
        return this.classService.deleteAssignment(id);
    }

    @Post("subject/:id")
    createSubject(@Body() subjectDTO: SubjectDTO, @Param("id") classID:string) {
        return this.classService.createSubject(subjectDTO, classID)
    }
}
