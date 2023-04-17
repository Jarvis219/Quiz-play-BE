import { IGoogleUser } from '@/types';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, lastValueFrom, map } from 'rxjs';
import { API_GOOGLE_GET_INFOR } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  login({ id }: { id: number }) {
    const jwtToken = this.jwtService.sign({ userId: id });
    return jwtToken;
  }

  async verifyTokenGoogle({ token }: { token: string }): Promise<IGoogleUser> {
    return await lastValueFrom(
      this.httpService
        .get(API_GOOGLE_GET_INFOR + '?access_token=' + token)
        .pipe(
          catchError((err) => {
            throw new Error(err);
          }),
          map(({ data }) => {
            return data;
          }),
        ),
    );
  }
}
