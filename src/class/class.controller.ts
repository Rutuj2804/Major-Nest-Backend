import { Controller, Post, Body, Delete, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/authentication/guard';
import { ClassService } from './class.service';
import { ClassDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('class')
export class ClassController {

    constructor(private classService: ClassService) {}

    @Post("create")
    createClass(@Body() classDTO: ClassDTO) {
        return this.classService.createClass(classDTO)
    }

    @Delete(":id")
    deleteClass(@Param("id") id:string){
        return this.classService.deleteClass(id)
    }

    @Post("add_students/:id")
    @UseInterceptors(FileInterceptor('file'))
    addStudents(@Param("id") id:string, @UploadedFile() file: Express.Multer.File){
        return this.classService.addStudents(id, file)
    }
}
