import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('/')
  // async getUsers(): Promise<UserDto[]> {
  //   return this.userService.users({});
  // }

  // @Post('register')
  // async signupUser(@Body() userData: UserDto): Promise<UserDto> {
  //   return this.userService.createUser(userData);
  // }

  // @Post('login')
  // async loginUser(@Body() userData: UserDto): Promise<UserDto> {
  //   return this.userService.createUser(userData);
  // }

  // @Delete('delete')
  // async deleteUser(@Body() userData: UserDto): Promise<UserDto> {
  //   return this.userService.deleteUser(userData);
  // }
}
