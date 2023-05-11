import { IsNotEmpty } from "class-validator";

export class AttendenceDTO {
    @IsNotEmpty()
    class: string;

    students: [string]
}