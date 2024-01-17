import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthUserDto} from "./dto/auth-user-dto";
import {AuthGuard} from "@nestjs/passport";
import {User} from "@prisma/client";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {Cookise} from "../globalDecorators/cookies.decorator";
import {Response} from "express";
type RequestWithUser = Request & { user: User };
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async create(@Body() dto: AuthUserDto, @Req() req, @Res({passthrough: true}) res: Response) {
        const token = await this.authService.login(dto);
        res.cookie('auth', true, {
            httpOnly: true,
            secure: true
        })
        res.cookie('accessToken', token.access_token, {
            // httpOnly: true,
            secure: true,
            maxAge: 20000
        })
        return token
    }

    @Get('/logout')
    async logout(@Res({passthrough: true}) res: Response) {
        return this.authService.logout(res)
    }

    @Get('check-cookie')
    async getCookie(@Res({passthrough: true}) res: Response) {
        return this.authService.getCookie(res)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: RequestWithUser) {
        return this.authService.getProfile(req.user)
    }
}
