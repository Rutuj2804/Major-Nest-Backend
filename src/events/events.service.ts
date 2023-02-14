import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from 'src/authentication/interface';
import { EventDTO } from './dto';
import { EventsInterface } from './interface';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel('Event')
        private readonly eventsModel: Model<EventsInterface>,
    ) { }

    async postEvent(
        user: AuthInterface,
        files: [Express.Multer.File],
        eventsDTO: EventDTO,
    ) {
        const filesArr = [];
        for (let i = 0; i < files.length; i++) {
            filesArr.push(files[i].path);
        }

        let event = new this.eventsModel({
            user: user,
            title: eventsDTO.title,
            description: eventsDTO.description,
            files: filesArr,
            university: eventsDTO.university,
        });
        event.save();
        event = await event.populate('user');
        return event;
    }

    async getEvents(id: string) {
        const events = await this.eventsModel
            .find({ university: id })
            .populate('user');
        return events;
    }

    async deleteEvents(id: string) {
        const events = await this.eventsModel.findByIdAndDelete(id);
        return events;
    }
}
