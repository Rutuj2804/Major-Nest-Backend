import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Model } from "mongoose";
import { AuthInterface } from "../interface";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService,@InjectModel('Auth') private readonly authModel: Model<AuthInterface>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "jwt secret for authentication 1234567890",
        })
    }

    async validate(payload: { sub: string, email: string }) {
        const user = await this.authModel.findById(payload.sub)
        delete user.password    
        return user
    }
}