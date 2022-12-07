import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthDTO } from './dto';

@Controller('authentication')
export class AuthenticationController {
    constructor(private authService: AuthenticationService) {}

    @Post('signup')
    signup(@Body() dto: AuthDTO) {
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto: AuthDTO) {
        return this.authService.signin(dto)
    }
}
