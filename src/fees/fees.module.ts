import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { acceptedFeeSchema, feeSchema } from './models';
import { classSchema } from 'src/class/model';
import { rolesSchema } from 'src/administration/model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Fee', schema: feeSchema },
      { name: 'Accepted Fee', schema: acceptedFeeSchema },
      { name: 'Class', schema: classSchema },
      { name: 'Role', schema: rolesSchema },
    ]),
  ],
  providers: [FeesService],
  controllers: [FeesController]
})
export class FeesModule {}
