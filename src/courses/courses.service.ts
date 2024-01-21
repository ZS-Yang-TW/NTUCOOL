import { Injectable } from '@nestjs/common';
import { Course } from './course.entity';
import { User } from '../users/user.entity';
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
        const course = this.courses.find(course => course.id === id);
        return course
    }

    // DB Load
    private loadCourses(): void {
        if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        console.log(data)
        this.courses = JSON.parse(data);
        if (this.courses.length > 0) {
            this.idCounter = Math.max(...this.courses.map(u => u.id)) + 1;
        }
        }
    }
}
