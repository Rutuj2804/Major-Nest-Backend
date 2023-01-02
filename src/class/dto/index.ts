import { IsNotEmpty } from "class-validator";

export class ClassDTO {
    @IsNotEmpty()
    university: string;

    @IsNotEmpty()
    name: string;

    faculty: [string];

    students: [string];
}

export class AssignmentDTO {
    submission: string;

    @IsNotEmpty()
    title: string;
    description: string;
}

export class SubjectDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    faculty: [string];
}