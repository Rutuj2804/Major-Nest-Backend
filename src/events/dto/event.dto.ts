import { IsNotEmpty, IsString } from "class-validator";

export class EventDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsString()
    university: string;

    description: string;
}