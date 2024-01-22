import { Get, Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/users/user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: CreateUserDto, @Res() res: Response) {
        const token = await this.authService.createToken(signInDto.name, signInDto.email);

        // 設置 cookie
        res.cookie('Bearer', token, {
            httpOnly: true, // 防止客戶端透過 JavaScript 訪問
            secure: process.env.NODE_ENV === 'production', // 在生產環境中使用 HTTPS
            // 之後可以設置其他適當的 Cookie 選項
        });

        // 發送響應
        return res.send({ message: 'Login successful' });
    }
}