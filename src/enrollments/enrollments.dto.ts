import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentsDto {
    @ApiProperty({ example: 1 })
    user: number;

    @ApiProperty({ example: 1 })
    course: number;

    @ApiProperty({ example: 'student' })
    role: string;
}