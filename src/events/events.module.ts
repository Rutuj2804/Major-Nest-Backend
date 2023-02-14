import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { eventSchema } from './models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: eventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule { }
