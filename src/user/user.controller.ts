import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

 @UseGuards(AuthGuard)
 @Controller('users')
 export class UserController {
  constructor(private readonly userService: UserService) {}
  
   @Get('profile')
   async getProfile(@Request() req:any) {
    const userId = req.locals?.userId
    const user = await this.userService.findOne(userId);
    return { message: 'User profile fetched', user };
  }
    
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
