import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
}

export const jwtConstants = {
    secret: 'aslkdn123noznd',
  };