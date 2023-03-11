import { IsNotEmpty } from "class-validator";

export class ChatRoomDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    users: [string];
}