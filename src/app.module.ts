import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true, 
    }),
    
     TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
       useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        database: 'newscript',
        entities: [],
        synchronize: true,
        logging: true,
        autoLoadEntities: true,

      }),
    }),
     TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'super-secret-sign-key', // by  default it will
      signOptions: { expiresIn: '1h' }, // by default it will 
    }),
     
     
  
],
  
   controllers: [AppController,UserController,AuthController],
   providers: [AppService,UserService,AuthService],
})
export class AppModule {}


