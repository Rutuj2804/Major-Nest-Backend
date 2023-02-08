import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { LectureDTO } from './dto/lecture.dto';
import { LectureService } from './lecture.service';

@UseGuards(JwtGuard)
@Controller('lecture')
export class LectureController {

    constructor(private lectureService: LectureService) {}

    @Post('create')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './upload/lectures',
                filename: (req, file, callback) => {
                    const date = Date.now();
                    callback(
                        null,
                        `${file.originalname.split('.')[0]}-${date}${extname(
                            file.originalname,
                        )}`,
                    );
                },
            }),
        }),
    )
    createLecture(
        @User() user: AuthInterface,
        @Body() lectureDTO: LectureDTO,
        @UploadedFile() file: Express.Multer.File,
    ) { 
        return this.lectureService.createLecture(user, lectureDTO, file)
    }

    @Get("class/:id")
    getLecturesOfClass(@Param("id") id: string){
        return this.lectureService.getLecturesOfClass(id)
    }

    @Get("single/:id")
    getLecture(@Param("id") id: string){
        return this.lectureService.getLecture(id)
    }

    @Delete(":id")
    deleteLecture(@Param("id") id: string){
        return this.lectureService.deleteLecture(id)
    }
}
