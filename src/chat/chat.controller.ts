import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/authentication/decorator';
import { JwtGuard } from 'src/authentication/guard';
import { AuthInterface } from 'src/authentication/interface';
import { ChatService } from './chat.service';
import { ChatRoomDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {

    constructor(private chatService:ChatService) {}

    @Post("room")
    createRoom(@Body() chatRoomDTO: ChatRoomDTO, @User() user: AuthInterface){
        return this.chatService.createRoom(chatRoomDTO, user)
    }

    @Get("room")
    getRooms(@User() user: AuthInterface) {
        return this.chatService.getRooms(user)
    }

    @Get("room/:id")
    getMessagesOfRooms(@Param(":id") id: string) {
        return this.chatService.getMessagesOfRooms(id)
    }

    @Post("room/:id")
    sendMessagesToRooms(@Param(":id") id: string, @Body("text") text:string, @User() user: AuthInterface) {
        return this.chatService.sendMessagesToRooms(id, text, user._id)
    }
}
