import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly enrollmentService: EnrollmentsService,
    ) {}

    @Get(':id')
    async getCourseById(@Param('id', ParseIntPipe) id: number) {
        let course = this.courseService.findCourseById(id);
        if (!course) {
        throw new BadRequestException('Course not found.');
        }
        return course;
    }

    //courses/{courseId}/users
    @Get(':id/users')
    getUsersByCourseId(@Param('id', ParseIntPipe) id: number): User[] {
        let course = this.courseService.findCourseById(id);
        if (!course) {
            throw new BadRequestException('Course not found.');
        }

        return new UsersService().findUsersByCourseId(id);
    }


}
