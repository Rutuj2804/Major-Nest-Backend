import { IsNotEmpty } from "class-validator";

export class LectureDTO {
    @IsNotEmpty()
    title: string;
    
    description: string;
    
    @IsNotEmpty()
    classID: string;
    
    @IsNotEmpty()
    subjectID: string;
}