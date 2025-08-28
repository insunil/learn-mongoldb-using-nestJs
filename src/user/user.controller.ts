import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
   @UseGuards(AuthGuard)
   @Get('profile')
  async getProfile(@Request() req:any) {
    console.log("new here")

    const userId = req.locals.userId
    console.log(req)
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
