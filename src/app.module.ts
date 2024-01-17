import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {PrismaService} from './prisma/prisma.service';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./auth/constants";
import {PassportModule} from "@nestjs/passport";
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '24h'
            }
        }),
        ReportsModule
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {
}
