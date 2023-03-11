import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { chatRoom } from './models/room.chat';
import { messageRoom } from './models/message.chat';

@Module({
  imports: [MongooseModule.forFeature([ { name: "Room", schema: chatRoom }, { name: "Message", schema: messageRoom }])],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
