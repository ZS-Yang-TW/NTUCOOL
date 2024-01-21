import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
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
        const course = this.courseService.findCourseById(id);
        if (!course) {
        throw new BadRequestException('Course not found.');
        }
        return course;
    }

    // @Get(':courseId/users')
    // findUsersInCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    //     const course = this.courseService.findCourseById(courseId);
    //     if (!course) {
    //     throw new BadRequestException('Course not found.');
    //     }
    //     return this.enrollmentService.findUsersByCourseId(courseId);
    // }

}
