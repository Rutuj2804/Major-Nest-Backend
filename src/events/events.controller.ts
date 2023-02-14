import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { EventsService } from './events.service';
import { EventDTO } from './dto/index';

@UseGuards(JwtGuard)
@Controller('events')
export class EventsController {

    constructor(private eventsService: EventsService) {}

    @Post('create')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './upload/events',
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
    postEvent(
        @User() user: AuthInterface,
        @UploadedFiles() files: [Express.Multer.File],
        @Body() eventsDTO: EventDTO
    ) {
        return this.eventsService.postEvent(user, files, eventsDTO)
    }

    @Get(":id")
    getEventsOfUniversity(@Param("id") id:string) {
        return this.eventsService.getEvents(id)
    }

    @Delete(":id")
    deleteEvent(@Param("id") id:string) {
        return this.eventsService.deleteEvents(id)
    }
}
