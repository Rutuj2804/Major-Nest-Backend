import { IsNotEmpty } from "class-validator";

export class ChatRoomDTO {
    name: string;

    @IsNotEmpty()
    users: [string];
}