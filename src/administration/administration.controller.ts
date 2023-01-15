import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { AdministrationService } from './administration.service';
import { AssignRolesDTO, DefineRolesDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('administration')
export class AdministrationController {

    constructor(private administrationService: AdministrationService) {}

    @Post("roles/define")
    defineRoles(@Body() defineRolesDTO: DefineRolesDTO) {
        return this.administrationService.defineRoles(defineRolesDTO)
    }

    @Put("roles/update/:id")
    updateDefinedRoles(@Body() defineRolesDTO: DefineRolesDTO, @Param("id") id:string) {
        return this.administrationService.updateDefinedRoles(defineRolesDTO, id)
    }

    @Delete("roles/delete/:id")
    deleteDefinedRoles(@Param("id") id:string) {
        return this.administrationService.deleteDefinedRoles(id)
    }

    @Delete("assigned/delete/:id")
    deleteAssignedRoles(@Param("id") id:string) {
        return this.administrationService.deleteAssignedRoles(id)
    }

    @Get("roles/university/:id")
    getDefinedRoles(@Param("id") id:string) {
        return this.administrationService.getDefinedRoles(id)
    }

    @Get("my/university/:id")
    getMyRoleForUniversity(@Param("id") id:string, @User() user: AuthInterface) {
        return this.administrationService.getMyRoleForUniversity(id, user._id)
    }

    @Post("assign/:universityID")
    assignRole(@Param("universityID") universityID:string, @Body() assignRolesDTO: AssignRolesDTO) {
        return this.administrationService.assignRole(universityID, assignRolesDTO)
    }

    @Get("assign/:universityID")
    getAssignRolesData(@Param("universityID") universityID:string, @User() user: AuthInterface) {
        return this.administrationService.getAssignRolesData(universityID, user._id)
    }
}
