import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { hash, verify } from 'argon2';
import { randomBytes } from 'crypto';
import { verify as verifyJwt } from 'jsonwebtoken';
import { SECRET_KEY } from 'src/common';
import {
  LoginUsernameBodyDto,
  RegisterViaUsernameDto,
} from 'src/common/auth.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('/init/me')
  async initMe(@Req() req) {
    const authorization = req.headers['authorization'];
    const jwtToken = authorization.split(' ')[1];
    try {
      if (!jwtToken) return null;
      const { userId } = verifyJwt(jwtToken, SECRET_KEY, {
        ignoreExpiration: false,
      }) as { userId: number };

      const user = await this.userService.getById(userId);

      user.password = undefined;

      return user;
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() body: RegisterViaUsernameDto) {
    const [user, email] = await Promise.all([
      this.userService.getByUsername(body.username),
      this.userService.getByEmail(body.email),
    ]);

    if (user) {
      throw new HttpException(
        `Username ${user.username} existed`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (email) {
      throw new HttpException(
        `Email ${body.email} existed`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPassword = await hash(body.password);
    const token = randomBytes(100).toString('hex');

    const { id } = await this.userService.create({
      username: body.username,
      email: body.email,
      password: newPassword,
      full_name: body.full_name,
      verify_email_token: token,
      avatar: body.avatar,
      phone_number: body.phone_number,
      address: body.address,
    });

    const accessToken = this.authService.login({ id });

    return {
      accessToken,
      user: {
        username: body.username,
        email: body.email,
        full_name: body.full_name,
        avatar: body.avatar,
        phone_number: body.phone_number,
        address: body.address,
      },
    };
  }

  @Post('login-via-username')
  async login(@Body() body: LoginUsernameBodyDto) {
    const user = await this.userService.findUserByCondition({
      OR: [{ username: body.username.trim() }, { email: body.username.trim() }],
    });

    if (!user || !(await verify(user.password, body.password))) {
      throw new HttpException(
        'Username or Password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = this.authService.login({ id: user.id });

    return {
      accessToken,
      user: {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar: user.avatar,
        phone_number: user.phone_number,
        address: user.address,
      },
    };
  }
}
