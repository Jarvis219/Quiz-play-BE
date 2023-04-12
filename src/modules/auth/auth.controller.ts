import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { hash, verify } from 'argon2';
import { randomBytes } from 'crypto';
import { verify as verifyJwt } from 'jsonwebtoken';
import { SECRET_KEY } from 'src/common';
import {
  LoginUsernameBodyDto,
  RegisterViaUsernameDto,
} from 'src/common/auth.dto';
import { IGoogleUser } from 'src/types';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/init/me')
  async initMe(@Req() req) {
    const authorization = req.headers['authorization'];
    const jwtToken = authorization.split(' ')[1];

    if (!jwtToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    try {
      const { userId } = verifyJwt(jwtToken, SECRET_KEY, {
        ignoreExpiration: false,
      }) as { userId: number };

      const user = await this.userService.getById(userId);

      const accessToken = this.authService.login({ id: user.id });

      user.id = undefined;
      user.password = undefined;

      return {
        accessToken,
        user,
      };
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register/username')
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

    const newUser = await this.userService.create({
      username: body.username,
      email: body.email,
      password: newPassword,
      full_name: body.full_name,
      verify_email_token: token,
      avatar: body.avatar,
      phone_number: body.phone_number,
      address: body.address,
    });

    const accessToken = this.authService.login({ id: newUser.id });

    newUser.id = undefined;
    newUser.password = undefined;

    return {
      accessToken,
      user: newUser,
    };
  }

  @Post('login/username')
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
    user.id = undefined;
    user.password = undefined;

    return {
      accessToken,
      user,
    };
  }

  @Post('login/google')
  async loginGoogle(@Body() body: { token: string }) {
    if (!body.token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    let data: IGoogleUser;

    try {
      data = (await this.authService.verifyTokenGoogle(body.token)).data;
    } catch (error) {
      throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
    }

    const currentUser = await this.userService.getByEmail(data.email);

    if (currentUser) {
      const accessToken = this.authService.login({ id: currentUser.id });

      currentUser.id = undefined;
      currentUser.password = undefined;

      return {
        accessToken,
        user: currentUser,
      };
    }

    const username = data.email.split('@')[0].replace('.', '');

    const newPassword = await hash(data.email);
    const token = randomBytes(100).toString('hex');

    const dataCreateUser = {
      username: username,
      email: data.email,
      full_name: data.name,
      avatar: data.picture,
      password: newPassword,
      phone_number: null,
      address: null,
      verify_email_token: token,
    };

    const newUser = await this.userService.create(dataCreateUser);

    const accessToken = this.authService.login({ id: newUser.id });

    newUser.id = undefined;
    newUser.password = undefined;

    return {
      accessToken,
      user: newUser,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send-email-verify')
  async sendEmailVerify(@Req() req) {
    const user = await this.userService.getById(req.user.id);

    try {
      await this.mailService.sendVerifyEmail({
        email: user.email,
        token: user.verify_email_token,
      });

      return {
        message: 'Send email verify success',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('confirm-email')
  async confirmEmail(@Body() body: { token: string }) {
    const user = await this.userService.getByVerifyEmailToken(body.token);

    if (!user) {
      throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
    }

    await this.userService.updateVerifyAcount(user.id);

    return {
      message: 'Verify email success',
    };
  }
}
