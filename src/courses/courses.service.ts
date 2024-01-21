import { Injectable } from '@nestjs/common';
import { Course } from './course.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import * as fs from 'fs';


@Injectable()
export class CoursesService {
    private courses: Course[] = [];
    private idCounter = 1;
    private readonly dataFile = 'courses.json';

    // Initialize the service by loading the courses from the DB
    constructor() {
        this.loadCourses();
    }

    // API Logic
    findCourseById(id: number): Course{
        let course = this.courses.find(course => course.id === id);
        return course
    }
    
    findCoursesByUserId(userId: number): Course[] {
        let enrollments = new EnrollmentsService().findEnrollmentsByUserId(userId);
        let courses = enrollments.map(enrollment => enrollment.course);
        return courses
    }

    // DB Load
    private loadCourses(): void {
        if (fs.existsSync(this.dataFile)) {
        let data = fs.readFileSync(this.dataFile, 'utf8');
        this.courses = JSON.parse(data);
        if (this.courses.length > 0) {
            this.idCounter = Math.max(...this.courses.map(u => u.id)) + 1;
        }
        }
    }
}
