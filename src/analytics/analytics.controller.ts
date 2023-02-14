import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {

    constructor(private analyticsService: AnalyticsService) {}

    @Get("cards/:id")
    getCardsData(@User() user: AuthInterface, @Param("id") university: string){
        return this.analyticsService.getCardsData(user._id, university)
    }

    @Get("line/:id")
    getLineChartData(@User() user: AuthInterface, @Param("id") university: string){
        return this.analyticsService.getLineChartData(user._id, university)
    }

    @Get("bar/:id")
    getBarChartData(@User() user: AuthInterface, @Param("id") university: string){
        return this.analyticsService.getBarChartData(user._id, university)
    }

    @Get("pie/:id")
    getPieChartData(@User() user: AuthInterface, @Param("id") university: string){
        return this.analyticsService.getPieChartData(user._id, university)
    }

    @Get("classes/:id")
    getClassesChartData(@User() user: AuthInterface, @Param("id") university: string){
        return this.analyticsService.getClassesChartData(user._id, university)
    }
}
