import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login({ id }: { id: number }) {
    const jwtToken = this.jwtService.sign({ userId: id });
    return jwtToken;
  }
}
