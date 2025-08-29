import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(CreateUserDto: CreateUserDto) {
    CreateUserDto.password = await bcrypt.hash(CreateUserDto.password, 2)
    return this.userService.create(CreateUserDto)
  }

  async login(payload: LoginDto) {
    const user: User = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtService.sign({ id: user._id }, {
      secret: this.configService.get<string>('JWT_PRIVATE_KEY'),
      expiresIn: '1h',
    });

    return {
      message: 'Login successful',
      token,
      user: user,
    };
  }
}


