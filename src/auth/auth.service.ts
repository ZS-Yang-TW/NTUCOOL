import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) {}

  createToken(name: string, email: string): any {
    const user = this.usersService.findOne(name);

    if (user?.email !== email) {
      throw new UnauthorizedException();
    }

    return "cool";
  }
}