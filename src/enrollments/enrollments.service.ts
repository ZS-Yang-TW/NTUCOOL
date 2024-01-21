import { Injectable } from '@nestjs/common';
import { Enrollment } from './enrollment.entity';
import { User } from '../users/user.entity';
import { CreateEnrollmentsDto } from './enrollments.dto';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';


@Injectable()
export class EnrollmentsService {
    private enrollments: Enrollment[] = [];
    private idCounter = 1;
    private readonly dataFile = 'enrollments.json';

    // Initialize the service by loading the enrollments from the DB
    constructor() {
        this.loadEnrollments();
    }

    // API Logic
    createEnrollment(enrollment: CreateEnrollmentsDto): Enrollment {
        const newEnrollment = {
            id: this.idCounter++,
            user: new UsersService().findUserById(enrollment.user),
            course: new CoursesService().findCourseById(enrollment.course),
            role: enrollment.role,
        };
        this.enrollments.push(newEnrollment);
        this.saveEnrollments();
        return newEnrollment;
    }

    // findUsersByCourseId(courseId: number): User[] {
    //     return this.enrollments
    //       .filter(enrollment => enrollment.course.id === courseId)
    //       .map(enrollment => enrollment.user);
    // }

    // DB Save & Load
    private saveEnrollments(): void {
        fs.writeFileSync(this.dataFile, JSON.stringify(this.enrollments));
    }

    private loadEnrollments(): void {
        if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        this.enrollments = JSON.parse(data);
        if (this.enrollments.length > 0) {
            this.idCounter = Math.max(...this.enrollments.map(u => u.id)) + 1;
        }
        }
    }
}
