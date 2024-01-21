import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ example: 'NtuCool' })
  name: string;

  @ApiProperty({ example: 'ntucool.admin@ntu.edu.tw' })
  email: string;
}