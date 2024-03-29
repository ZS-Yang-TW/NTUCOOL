import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentsDto {
    @ApiProperty({ example: 1 })
    user: number;

    @ApiProperty({ example: 1 })
    course: number;

    @ApiProperty({ example: 'student' })
    role: 'student' | 'teacher';
}

export class QueryEnrollmentsBycourseIdDto {
    @ApiProperty({ required: false })
    user: number;

    @ApiProperty({ required: false })
    role: 'student' | 'teacher';
}

export class QueryEnrollmentsByUserIdDto {
    @ApiProperty({ required: false })
    course: number;

    @ApiProperty({ required: false })
    role: 'student' | 'teacher';
}