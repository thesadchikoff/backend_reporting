import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {PrismaService} from "../prisma/prisma.service";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [
    forwardRef(() => AuthModule)
  ],
  controllers: [
      UserController,
  ],
  providers: [UserService, PrismaService, AuthService, JwtService]
})
export class UserModule {}
