import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';


import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly userSer: UserService,
              private readonly jwtSer:JwtService,
              private readonly configSer:ConfigService
  ) { }

  async register(CreateUserDto: CreateUserDto) {
    try {
      CreateUserDto.password = await bcrypt.hash(CreateUserDto.password, 2)
      return this.userSer.create(CreateUserDto)
    }
    catch (err:any) {
      throw new InternalServerErrorException('bcrypt error: ' + err.message);
    }
  }

  async login(payload: LoginDto) {

    console.log("here",payload)
    const user: User = await this.userSer.findByEmail(payload.email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const token = await this.jwtSer.sign({id:user._id}, {
      secret: this.configSer.get<string>('JWT_PRIVATE_KEY') || 'jwt',
      expiresIn: '1h',
    });
   
    return {
      message: 'Login successful',
      token,
      user: user,
    };
  }


  
}


