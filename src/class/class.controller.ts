import { Controller, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
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
}
