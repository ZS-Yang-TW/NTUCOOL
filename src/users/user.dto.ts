import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'NtuCool' })
    name: string;
    
    @ApiProperty({ example: 'ntucool@ntu.edu.tw' })
    email: string;
}

export class QueryUserDto {
    @ApiProperty({ required: false })
    email?: string;

    @ApiProperty({ required: false })
    name?: string;
}

export class UpdateUserDto {
    @ApiProperty({ example: 'NtuCool' })
    name: string;

    @ApiProperty({ example: 'ntucool.admin@ntu.edu.tw' })
    email: string;
}