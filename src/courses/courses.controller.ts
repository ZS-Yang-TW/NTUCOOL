import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import { UsersService } from 'src/users/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly userService: UsersService,
    ) {}

    @Get(':id')
    getCourseById(@Param('id', ParseIntPipe) id: number) : Course {
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

        return this.userService.findUsersByCourseId(id);
    }
}
