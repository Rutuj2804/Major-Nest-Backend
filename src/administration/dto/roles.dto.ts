import { IsNotEmpty } from "class-validator";

export class RolesDTO {

    @IsNotEmpty()
    university: string;

    @IsNotEmpty()
    roles: [string];
}

export class DefineRolesDTO {

    @IsNotEmpty()
    university: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    students: number;
    
    @IsNotEmpty()
    faculty: number;
}