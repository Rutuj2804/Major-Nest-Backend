import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { FeesDTo } from './dto';
import { FeesService } from './fees.service';

@UseGuards(JwtGuard)
@Controller('fees')
export class FeesController {

    constructor(private lectureService: FeesService) {}

    @Post("demand/:id")
    demandFees(@Param("id") classId: string, @Body() feesDTO: FeesDTo, @User() user: AuthInterface) {
        return this.lectureService.demandFees(classId, feesDTO, user)
    }

    @Delete("demand/:id")
    deleteDemandFees(@Param("id") classId: string) {
        return this.lectureService.deleteDemandFees(classId)
    }

    @Get("demand/:id")
    getDemandFees(@Param("id") university: string, @User() user: AuthInterface) {
        return this.lectureService.getDemandFees(university, user._id)
    }

    @Post("accept/:id")
    postAcceptedFees(@Param("id") feeId: string, @User() user: AuthInterface) {
        return this.lectureService.postAcceptedFees(feeId, user)
    }
}
