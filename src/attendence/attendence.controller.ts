import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/authentication/guard';
import { AttendenceDTO } from './dto';
import { AttendenceService } from './attendence.service';
import { User } from 'src/authentication/decorator';
import { AuthInterface } from 'src/authentication/interface';

@UseGuards(JwtGuard)
@Controller('attendence')
export class AttendenceController {

    constructor(private attendenceService: AttendenceService) {}

    @Post("create")
    addAttendence(@Body() attendenceDTO: AttendenceDTO, @User() user: AuthInterface) {
        return this.attendenceService.addAttendence(attendenceDTO, user._id)
    }

    @Get("attendence/:id")
    getClassAttendence(@Param("id") classID: string) {
        return this.attendenceService.getClassAttendence(classID)
    }

    @Delete("attendence/:id")
    deleteClassAttendence(@Param("id") attendenceID: string) {
        return this.attendenceService.deleteClassAttendence(attendenceID)
    }
}
