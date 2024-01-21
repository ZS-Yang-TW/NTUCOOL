import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { EnrollmentsService } from './enrollments.service';
import { UsersService } from 'src/users/users.service';
import { CreateEnrollmentsDto, QueryEnrollmentsByUserIdDto, QueryEnrollmentsBycourseIdDto } from './enrollments.dto';
import { ApiTags } from '@nestjs/swagger';
import { Enrollment } from './enrollment.entity';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly enrollmentService: EnrollmentsService,
    ) {}

    @Post()
    async createEnrollment(@Body() enrollment: CreateEnrollmentsDto) {
        let course = this.courseService.findCourseById(enrollment.course);
        let user = new UsersService().findUserById(enrollment.user);

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

    @Get(':id')
    async getEnrollmentById(@Param('id', ParseIntPipe) id: number) {
        let enrollment = this.enrollmentService.findEnrollmentById(id);
        if (!enrollment) {
        throw new BadRequestException('Enrollment not found.');
        }
        return enrollment;
    }

    //enrollments/course/{courseId}/?user=1&role=student
    @Get('course/:id')
    queryEnrollmentsByCourseId(@Param('id', ParseIntPipe) id: number, @Query() query: QueryEnrollmentsBycourseIdDto) {
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
            if (user && enrollment.user.id !== Number(user)) {
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
    queryEnrollmentsByUserId(@Param('id', ParseIntPipe) id: number, @Query() query: QueryEnrollmentsByUserIdDto) {
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
            if (course && enrollment.course.id !== Number(course)) {
                return false;
            }

            if (role && enrollment.role !== role) {
                return false; 
            }

            return true;
        });
    }

    @Delete(':id')
    async deleteEnrollment(@Param('id', ParseIntPipe) id: number) {
        let enrollment = this.enrollmentService.findEnrollmentById(id);
        if (!enrollment) {
            throw new BadRequestException('Enrollment not found.');
        }

        return this.enrollmentService.deleteEnrollment(id);
    }
}
