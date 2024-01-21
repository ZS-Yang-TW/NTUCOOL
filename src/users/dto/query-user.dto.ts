import { ApiProperty } from "@nestjs/swagger";

export class QueryUserDto {
    @ApiProperty({ required: false })
    email?: string;

    @ApiProperty({ required: false })
    name?: string;
  }