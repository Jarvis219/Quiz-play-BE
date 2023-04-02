import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/common/user.dto';
import { UserService } from './user.service';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers(): Promise<UserDto[]> {
    return this.userService.users({});
  }

  @Post('register')
  async signupUser(@Body() userData: UserDto): Promise<UserDto> {
    return this.userService.createUser(userData);
  }

  @Post('login')
  async loginUser(@Body() userData: UserDto): Promise<UserDto> {
    return this.userService.createUser(userData);
  }

  @Delete('delete')
  async deleteUser(@Body() userData: UserDto): Promise<UserDto> {
    return this.userService.deleteUser(userData);
  }
}
