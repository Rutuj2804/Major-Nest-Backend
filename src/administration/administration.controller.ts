import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/authentication/guard';
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

    @Get("roles/university/:id")
    getDefinedRoles(@Param("id") id:string) {
        return this.administrationService.getDefinedRoles(id)
    }

    @Post("assign/:universityID")
    assignRole(@Param("universityID") universityID:string, @Body() assignRolesDTO: AssignRolesDTO) {
        return this.administrationService.assignRole(universityID, assignRolesDTO)
    }
}
