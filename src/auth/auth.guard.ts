import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
 
   
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      
      const secret = this.configService.get<string>('JWT_PRIVATE_KEY');
      const payload = this.jwtService.verify(token, { secret });
   console.log("here",payload)
      
      request.locals = { userId: payload.id};
       console.log("here",payload)
     console.log(request.locals)
      return true; 
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
