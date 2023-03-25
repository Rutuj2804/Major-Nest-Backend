import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { ChatRoomDTO } from './dto';
import { ChatRoomInterface, MessageInterface } from './interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Room') private readonly chatModel: Model<ChatRoomInterface>,
        @InjectModel('Message')
        private readonly messageModel: Model<MessageInterface>,
    ) { }

    async createRoom(chatRoomDTO: ChatRoomDTO, user: AuthInterface) {
        if (chatRoomDTO.users.length > 1) {
            let newRoom = new this.chatModel({
                name: chatRoomDTO.name,
                users: chatRoomDTO.users,
                admin: user._id,
            });
            newRoom.save();
            newRoom = await this.chatModel
                .findById(newRoom._id)
                .populate('users')
                .populate('admin')
                .populate('messages');
            return newRoom;
        } else {
            let newRoom = new this.chatModel({
                users: chatRoomDTO.users,
                admin: user._id,
            });
            newRoom.save();
            newRoom = await this.chatModel
                .findById(newRoom._id)
                .populate('users')
                .populate('admin')
                .populate('messages');
            return newRoom;
        }
    }

    async getRooms(user: AuthInterface) {
        const rooms = await this.chatModel
            .find({ $or: [{ users: user._id }, { admin: user._id }] })
            .sort({ updatedAt: -1 })
            .populate('users')
            .populate('admin')
            .populate('messages');
        return rooms;
    }

    async getRoomSingle(id: string) {
        const rooms = await this.chatModel
            .findById(id)
            .populate('users')
            .populate('admin')
            .populate('messages');
        return rooms;
    }

    async getMessagesOfRooms(id: string) {
        const rooms = await this.chatModel
            .findById(id)
            .populate('users')
            .populate('messages');

        for (let i = 0; i < rooms.messages.length; i++) {
            await this.messageModel.findByIdAndUpdate(rooms.messages[i]._id, {
                isRead: true,
            });
        }
        return rooms;
    }

    async sendMessagesToRooms(id: string, text: string, user: string) {
        let msg = new this.messageModel({ text: text, sender: user });
        msg.save()
        await this.chatModel
            .findByIdAndUpdate(
                id,
                { $push: { messages: msg } },
                { returnOriginal: false },
            )
            .populate('users');
        return msg;
    }
}
