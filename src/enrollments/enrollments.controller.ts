import { Controller, Post, Get, Delete, Body, Param, Query, BadRequestException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Enrollment } from './enrollment.entity';
import { CreateEnrollmentsDto, QueryEnrollmentsByUserIdDto, QueryEnrollmentsBycourseIdDto } from './enrollments.dto';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from './enrollments.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';

import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly enrollmentService: EnrollmentsService,
        private readonly userService: UsersService,
        
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    createEnrollment(@Body() enrollment: CreateEnrollmentsDto) : Enrollment {
        let course = this.courseService.findCourseById(enrollment.course);
        let user = this.userService.findUserById(enrollment.user);

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
        let enrolledUsers = this.userService.findUsersByCourseId(enrollment.course);

        if (enrolledUsers.some(enrolledUser => enrolledUser.id === user.id)) {
            throw new BadRequestException('User has already enrolled in the course');
        }

        return this.enrollmentService.createEnrollment(enrollment);
    }

    @Get(':id')
    getEnrollmentById(@Param('id', ParseIntPipe) id: number) : Enrollment {
        let enrollment = this.enrollmentService.findEnrollmentById(id);
        if (!enrollment) {
        throw new BadRequestException('Enrollment not found.');
        }
        return enrollment;
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteEnrollment(@Param('id', ParseIntPipe) id: number) : Enrollment {
        let enrollment = this.enrollmentService.findEnrollmentById(id);
        if (!enrollment) {
            throw new BadRequestException('Enrollment not found.');
        }

        return this.enrollmentService.deleteEnrollment(id);
    }
    
    //enrollments/course/{courseId}/?user=1&role=student
    @Get('course/:id')
    queryEnrollmentsByCourseId(@Param('id', ParseIntPipe) id: number, @Query() query: QueryEnrollmentsBycourseIdDto) : Enrollment[] {
        let { user, role } = query;
        let course = this.courseService.findCourseById(id);

        if (!course) {
            throw new BadRequestException('Course not found.');
        }

        if (user && !new UsersService().findUserById(Number(user))) {
            throw new BadRequestException('User not found.');
        }

        if (role && role != 'student' && role != 'teacher') {
            throw new BadRequestException('Role not found.');
        }

        let enrollments = this.enrollmentService.findEnrollmentsByCourseId(id);
        
        return enrollments.filter(enrollment => {
            if (user && enrollment.userId !== Number(user)) {
                return false;
            }

            if (role && enrollment.role !== role) {
                return false; 
            }

            return true;
        });
    }

    //enrollments/users/{userId}/?course=1&role=student
    @Get('users/:id')
    queryEnrollmentsByUserId(@Param('id', ParseIntPipe) id: number, @Query() query: QueryEnrollmentsByUserIdDto) : Enrollment[] {
        let { course, role } = query;

        let user = new UsersService().findUserById(id);

        if (!user) {
            throw new BadRequestException('User not found.');
        }

        if (course && !this.courseService.findCourseById(Number(course))) {
            throw new BadRequestException('Course not found.');
        }

        if (role && role != 'student' && role != 'teacher') {
            throw new BadRequestException('Role not found.');
        }

        let enrollments = this.enrollmentService.findEnrollmentsByUserId(id);
        
        return enrollments.filter(enrollment => {
            if (course && enrollment.courseId !== Number(course)) {
                return false;
            }

            if (role && enrollment.role !== role) {
                return false; 
            }

            return true;
        });
    }
}
