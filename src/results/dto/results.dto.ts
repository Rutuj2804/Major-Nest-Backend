import { IsNotEmpty } from "class-validator";

export class ResultDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    classID: string;

    @IsNotEmpty()
    subjectID: string;
}