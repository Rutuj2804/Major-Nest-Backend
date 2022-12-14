import { IsNotEmpty } from "class-validator";

export class ClassDTO {
    @IsNotEmpty()
    university: string;

    @IsNotEmpty()
    name: string;

    faculty: [string];

    students: [string];
}