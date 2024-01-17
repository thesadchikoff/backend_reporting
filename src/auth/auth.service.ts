import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthUserDto} from "./dto/auth-user-dto";
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import * as bc from 'bcrypt'
import {User} from "@prisma/client";
import {Response} from "express";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        // private readonly logger = new Logger()
    ) {}

    async validateUser(dto: AuthUserDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            }
        })
        const passwordCompaire = await bc.compare(dto.password, user.password)
        if (user && passwordCompaire) {
            const {password, ...response} = user
            return response
        }
        throw new HttpException('Ошибка авторизации', HttpStatus.BAD_REQUEST)
    }

    async generateToken(dto: AuthUserDto) {
        const user = await this.validateUser(dto)

        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        const token = this.jwtService.sign(user, {
            secret: jwtConstants.secret,
            expiresIn: '24h'
        })
        return {
            user: user,
            token: token
        }
    }

    async getCookie(res: Response) {
        const cookie = res.cookie('auth', true)
    }

    async login(dto: AuthUserDto) {
        // this.logger.log(`Пользователь ${dto.email} авторизовался`)
        const token = await this.generateToken(dto)
        return {
            access_token: token.token,
            user: token.user
        }
    }

    async logout(res: Response) {
        res.clearCookie('accessToken')
        return true
    }

    async getProfile(payload: User) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.id
            },
            include: {
                reports: true
            }
        })
        if (user) {
            const {password, ...response} = user
            return response
        }
        throw new HttpException('Профиль не найден', HttpStatus.NOT_FOUND)
    }

}
