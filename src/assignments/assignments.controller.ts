import {
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { AssignmentsService } from './assignments.service';

@UseGuards(JwtGuard)
@Controller('assignments')
export class AssignmentsController {

    constructor(private assignmentService: AssignmentsService) {}

    @Post('submit/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './upload/submissions',
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
    submitAssignment(
        @User() user: AuthInterface,
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) { 
        return this.assignmentService.submitAssignment(user._id, id, file)
    }

    @Get(":id")
    getSubmissionsByAssignmentId(@Param('id') id: string){
        return this.assignmentService.getSubmissionsByAssignmentId(id)
    }
}
