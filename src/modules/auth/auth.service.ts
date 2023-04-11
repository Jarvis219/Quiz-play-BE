import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { API_GOOGLE_GET_INFOR } from 'src/common';
import { request } from 'src/services/request';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login({ id }: { id: number }) {
    const jwtToken = this.jwtService.sign({ userId: id });
    return jwtToken;
  }

  async verifyTokenGoogle(token: string) {
    return await request.get(API_GOOGLE_GET_INFOR + '?access_token=' + token);
  }
}
