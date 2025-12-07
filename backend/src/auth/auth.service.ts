import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(username);
    // TODO: Use hashed passwords
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign({ payload }, { expiresIn: '15m' });

    const refreshToken = this.jwtService.sign({ payload }, { expiresIn: '7d' });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  refreshToken(refreshToken: string): {
    accessToken: string;
    refreshToken: string;
  } {
    if (!refreshToken) throw new UnauthorizedException();

    const {
      sub: userId,
      username: userUsername,
    }: { sub: string; username: string } = this.jwtService.verify(refreshToken);

    const payload = { sub: userId, username: userUsername };

    const newRefreshToken = this.jwtService.sign(
      { payload },
      { expiresIn: '7d' },
    );

    const accessToken = this.jwtService.sign({ payload }, { expiresIn: '15m' });
    return { accessToken, refreshToken: newRefreshToken };
  }
}
