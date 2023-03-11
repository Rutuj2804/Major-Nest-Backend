import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto';
import * as argon from "argon2"
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthInterface } from './interface';
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthenticationService {

    constructor(@InjectModel('Auth') private readonly authModel: Model<AuthInterface>, private jwt:JwtService, private config:ConfigService) {}

    async signup(dto: AuthDTO) {

        try {
            // generate hash
            const hash = await argon.hash(dto.password);
            // save new user
            const user = new this.authModel({email: dto.email, password: hash, firstname: dto.firstname, lastname: dto.lastname})
            await user.save()
    
            return this.signToken(`${user._id}`, user.email)
            
        } catch (error) {
            if(error.code === 11000){
                throw new ForbiddenException("Credentials already taken")
            }
            throw error
        }
        
    }

    async signin(dto: AuthDTO) {
        // find user
        const user = await this.authModel.findOne({ email: dto.email })
        // if does not exist throw error
        if(!user) throw new ForbiddenException("Invalid credentials")

        // compare password
        const pwMatches = await argon.verify(user.password, dto.password)
        // if password not matching throw error
        if(!pwMatches) throw new ForbiddenException("Invalid credentials")

        // send user
        return this.signToken(`${user._id}`, user.email)
    }

    async signToken(userID: string, email: string): Promise<{ token: string }>{
        const data = {
            sub: userID,
            email
        }

        const secret = this.config.get("JWT_SECRET")

        const token = await this.jwt.signAsync(data, {
            secret: secret
        })

        return {
            token: token
        }
    }

    async getUsers(username: string) {
        const users = await this.authModel.find({ email: { $regex: username, $options : 'i' } })
        return users
    }

}
