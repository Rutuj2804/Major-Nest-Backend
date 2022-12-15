import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { authSchema } from './model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Auth', schema: authSchema }]), JwtModule.register({})],
    providers: [AuthenticationService, JwtStrategy],
    controllers: [AuthenticationController],
    exports: [MongooseModule]
})
export class AuthenticationModule {}
