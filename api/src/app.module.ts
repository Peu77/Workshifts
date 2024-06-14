import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { ShiftModule } from './shift/shift.module';
import { UserModule } from './user/user.module';
import { VacationModule } from './vacation/vacation.module';
import { HolidayModule } from './holiday/holiday.module';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true
    }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow<string>('DB_HOST'),
                port: configService.getOrThrow<number>('DB_PORT'),
                username: configService.getOrThrow<string>('DB_USERNAME'),
                password: configService.getOrThrow<string>('DB_PASSWORD'),
                database: configService.getOrThrow<string>('DB_NAME'),
                entities: ["dist/**/*.entity{.ts,.js}"],
                migrations: [],
                synchronize: true,
                autoLoadEntities: true,
            })
        }),
        ShiftModule,
        UserModule,
        VacationModule,
        HolidayModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
