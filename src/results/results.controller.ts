import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { ResultDTO } from './dto';
import { ResultsService } from './results.service';

@UseGuards(JwtGuard)
@Controller('results')
export class ResultsController {
    constructor(private resultService: ResultsService) {}

    @Post('create/:id')
    @UseInterceptors(
        FileInterceptor('file'),
    )
    createResult(
        @User() user: AuthInterface,
        @Body() resultsDto: ResultDTO,
        @UploadedFile() file: Express.Multer.File,
        @Param("id") university: string
    ) { 
        return this.resultService.createResult(user._id, resultsDto, file, university)
    }

    @Get('get/:id')
    getResult(
        @User() user: AuthInterface,
        @Param("id") university: string
    ) { 
        return this.resultService.getResult(university, user._id)
    }

    @Get('result/:id')
    getSingleResult(
        @User() user: AuthInterface,
        @Param("id") resultID: string
    ) { 
        return this.resultService.getSingleResult(resultID, user._id)
    }

    @Put('delete')
    deleteResult(
        @Body("id") data: [string]
    ) { 
        return this.resultService.deleteResult(data)
    }
}
