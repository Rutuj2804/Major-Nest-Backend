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
    
    @IsNotEmpty()
    class: number;
    
    @IsNotEmpty()
    subjects: number;
    
    @IsNotEmpty()
    events: number;
    
    @IsNotEmpty()
    utilities: number;
    
    @IsNotEmpty()
    assignments: number;
    
    @IsNotEmpty()
    roles: number;
}

export class AssignRolesDTO {
    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    role: string;
}