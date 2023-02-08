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
    Get,
    Put,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { ClassService } from './class.service';
import { AssignmentDTO, ClassDTO, ManulStudentAddDTO, SubjectDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('class')
export class ClassController {
    constructor(private classService: ClassService) { }

    @Post('create')
    createClass(@Body() classDTO: ClassDTO) {
        return this.classService.createClass(classDTO);
    }

    @Put('update/:id')
    updateClass(@Body() classDTO: ClassDTO, @Param('id') id: string) {
        return this.classService.updateClass(classDTO, id);
    }

    @Delete(':id')
    deleteClass(@Param('id') id: string) {
        return this.classService.deleteClass(id);
    }

    @Put('delete')
    deleteClasses(@Body('classes') arr: [string]) {
        return this.classService.deleteClasses(arr);
    }

    @Get("classes/:id")
    getAllClasses(@Param('id') id: string) {
        return this.classService.getAllClasses(id)
    }

    @Get("class/:id")
    getClassByID(@Param('id') id: string) {
        return this.classService.getClassByID(id)
    }

    @Get("/faculty/classes/:id")
    getMyClasses(@Param('id') id: string, @User() user: AuthInterface) {
        return this.classService.getMyClasses(id, user._id)
    }

    @Get("my")
    getMySubjects(@User() user: AuthInterface) {
        return this.classService.getMySubjects(user._id)
    }

    @Get("admin/:id")
    getAllSubjects(@Param('id') id: string) {
        return this.classService.getAllSubjects(id)
    }

    @Post('add_students/:id')
    @UseInterceptors(FileInterceptor('file'))
    addStudents(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.classService.addStudents(id, file);
    }

    @Post("manualAdd_students/:id")
    addStudentManual(@Param('id') id: string, @Body() manulStudentAddDTO: ManulStudentAddDTO) {
        return this.classService.addStudentManual(id, manulStudentAddDTO)
    }

    @Put("add_students/:id")
    deleteStudentsFromClass(@Param('id') id: string, @Body("students") students:[string]){
        return this.classService.deleteStudentsFromClass(id, students)
    }

    @Get("add_students/:id")
    getStudentsOfUniversity(@Param('id') id: string,){
        return this.classService.getAllStudents(id)
    }

    @Get("add_students/faculty/:id")
    getStudentsOfFaculty(@Param('id') id: string, @User() user: AuthInterface){
        return this.classService.getStudentsOfFaculty(id, user._id)
    }

    @Post('add_faculty/:id')
    @UseInterceptors(FileInterceptor('file'))
    addFaculty(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.classService.addFaculty(id, file);
    }

    @Post("manualAdd_faculty/:id")
    addFacultyManual(@Param('id') id: string, @Body() manulStudentAddDTO: ManulStudentAddDTO) {
        return this.classService.addFacultyManual(id, manulStudentAddDTO)
    }

    @Put("add_faculty/:id")
    deleteFacultyFromClass(@Param('id') id: string, @Body("faculty") faculty:[string]){
        return this.classService.deleteFacultyFromClass(id, faculty)
    }

    @Post('add_notes/:id/:subjectID')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: "./upload/notes",
            filename: (req, file, callback) => {
                const date = Date.now()
                callback(null, `${file.originalname.split('.')[0]}-${date}${extname(file.originalname)}`)
            }
        })
    }))
    addNotesToClass(
        @Param('id') id: string,
        @Param('subjectID') subjectId: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @User() user: AuthInterface
    ) {
        return this.classService.addNotes(id, subjectId, files, user._id);
    }

    @Put('add_notes')
    deleteNotesFromClass(
        @Body('id') id: [string],
    ) {
        return this.classService.deleteNotes(id);
    }

    @Get("add_notes/:id")
    getNotesFromSubject(@Param('id') id: string) {
        return this.classService.getNotesFromSubject(id)
    }

    @Get("add_notes")
    getAllNotes(@User() user: AuthInterface) {
        return this.classService.getAllNotes(user._id)
    }

    @Post('add_assignments/:id/:subjectID')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: "./upload/assignments",
            filename: (req, file, callback) => {
                const date = Date.now()
                callback(null, `${file.originalname.split('.')[0]}-${date}${extname(file.originalname)}`)
            }
        })
    }))
    addAssignmentToClass(
        @Param('id') id: string,
        @Param('subjectID') subjectId: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() assignmentDTO:AssignmentDTO,
        @User() user: AuthInterface
    ) {
        return this.classService.addAssignment(id, subjectId, files, assignmentDTO, user);
    }

    @Put('add_assignments')
    deleteAssignmentFromClass(
        @Body('id') id: [string],
    ) {
        return this.classService.deleteAssignment(id);
    }

    @Get("add_assignments")
    getAllAssignments(@User() user: AuthInterface) {
        return this.classService.getAllAssignments(user._id)
    }

    @Post("subject/:id")
    createSubject(@Body() subjectDTO: SubjectDTO, @Param("id") classID:string) {
        return this.classService.createSubject(subjectDTO, classID)
    }
    
    @Delete("subject/:id")
    deleteSubject(@Param("id") subjectID:string) {
        return this.classService.deleteSubject(subjectID)
    }

    @Put("subject")
    deleteBulkSubject(@Body("id") subjectID:[string]) {
        return this.classService.deleteBulkSubject(subjectID)
    }

    @Get("subject/:id")
    getSubjects(@Param("id") classID:string) {
        return this.classService.getSubjectsOfAClass(classID)
    }
}
