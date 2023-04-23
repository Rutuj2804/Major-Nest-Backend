import { IsNotEmpty } from "class-validator";

export class FeesDTo {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    university: string;

    @IsNotEmpty()
    amount: number;
}