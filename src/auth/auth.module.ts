import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {PrismaService} from "../prisma/prisma.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import {jwtConstants} from "./constants";
import {JwtStrategy} from "../strategy";

@Module({
  imports: [
      forwardRef(() => UserModule),
      PassportModule,
      JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: {
              expiresIn: '24h'
          }
      })
  ],
  providers: [AuthService, PrismaService, UserService, JwtService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
