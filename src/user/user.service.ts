import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as bc from 'bcrypt'
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string) {
    return bc.hash(password, 5)
  }
  async create(dto: CreateUserDto, ) {
    dto.password = await this.hashPassword(dto.password)
    const user = await this.prisma.user.create({
      data: dto
    })
    const { password, ...response } = user
    return response
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        second_name: true,
        email: true,
        createdAt: true
      }
    })
    if (users.length <= 0) {
      throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND)
    }
    return users
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        first_name: true,
        second_name: true,
      }
    })
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
    return user
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
