import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { get } from 'lodash';
import { SECRET_KEY } from 'src/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Optional check authorization header
    if (!req.headers['authorization']) return next();

    // Optional add user to req
    try {
      const jwtToken = get(req.headers['authorization']?.split(' '), 1, '');
      const { userId } = verify(jwtToken, SECRET_KEY) as { userId: number };
      const user = await this.userService.getById(userId);

      req['user'] = user;
    } catch (err) {
      console.log('JWT Error');
    }

    next();
  }
}
