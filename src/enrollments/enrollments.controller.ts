import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from './enrollments.service';
import { UsersService } from '../users/users.service';
import { CreateEnrollmentsDto } from './enrollments.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly enrollmentService: EnrollmentsService,
    ) {}

    @Post()
    async createEnrollment(@Body() enrollment: CreateEnrollmentsDto) {
        var course = this.courseService.findCourseById(enrollment.course);
        var user = new UsersService().findUserById(enrollment.user);

        if (!user) {
            throw new BadRequestException('User not found.');
        }

        if (!course) {
            throw new BadRequestException('Course not found.');
        }

        if (enrollment.role != 'student' && enrollment.role != 'teacher') {
            throw new BadRequestException('Role not found.');
        }

        // Situation: User has already enrolled in the course


        return this.enrollmentService.createEnrollment(enrollment);
    }

}
