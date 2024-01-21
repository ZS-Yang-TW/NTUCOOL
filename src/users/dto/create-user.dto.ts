import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'NtuCool' })
  name: string;

  @ApiProperty({ example: 'ntucool@ntu.edu.tw' })
  email: string;
}