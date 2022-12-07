import { IsNotEmpty, IsString } from "class-validator";

export class UniversityDTO {
    @IsNotEmpty()
    @IsString()
    name: string
}