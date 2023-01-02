import { Controller, UseGuards, Get, Post, Body, Param, Put } from '@nestjs/common';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { UniversityDTO } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get("me")
    getUser(@User() user: AuthInterface) {
        return user
    }

    @Post("university")
    createUniversity(@User() user:AuthInterface, @Body() universityDTO: UniversityDTO) {
        return this.userService.createUniveristy(universityDTO, user)
    }

    @Put("university/:id")
    updateUniversity(@Param("id") id:string, @Body() universityDTO: UniversityDTO) {
        return this.userService.updateUniversity(id, universityDTO)
    }

    @Get("university/:id")
    getUniversity(@Param("id") id:string) {
        return this.userService.getUniversity(id)
    }

    @Get("universities")
    getUniversities(@User() user:AuthInterface) {
        return this.userService.getAllUniversities(user._id)
    }
}
