import { Injectable } from '@nestjs/common';
import { Enrollment } from './enrollment.entity';
import { User } from 'src/users/user.entity';
import { CreateEnrollmentsDto } from './enrollments.dto';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
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
        let newEnrollment = {
            id: this.idCounter++,
            user: new UsersService().findUserById(enrollment.user),
            course: new CoursesService().findCourseById(enrollment.course),
            role: enrollment.role,
        };
        this.enrollments.push(newEnrollment);
        this.saveEnrollments();
        return newEnrollment;
    }

    queryEnrollments(user?: number, role?: string): Enrollment[] {
        return this.enrollments.filter(enrollment => {
            if (user && enrollment.user.id !== user) {
                return false;
            }

            if (role && enrollment.role !== role) {
                return false; 
            }

            return true;
        });
    }

    deleteEnrollment(id: number): Enrollment {
        let index = this.enrollments.findIndex(enrollment => enrollment.id === id);
        let enrollment = this.enrollments.splice(index, 1)[0];
        this.saveEnrollments();

        return enrollment;
    }

    findEnrollmentById(id: number): Enrollment {
        let enrollment = this.enrollments.find(enrollment => enrollment.id === id);
        return enrollment
    }

    findEnrollmentsByUserId(userId: number): Enrollment[] {
        return this.enrollments.filter(enrollment => enrollment.user.id === userId);
    }

    findEnrollmentsByCourseId(courseId: number): Enrollment[] {
        return this.enrollments.filter(enrollment => enrollment.course.id === courseId);
    }


    // DB Save & Load
    private saveEnrollments(): void {
        fs.writeFileSync(this.dataFile, JSON.stringify(this.enrollments));
    }

    private loadEnrollments(): void {
        if (fs.existsSync(this.dataFile)) {
        let data = fs.readFileSync(this.dataFile, 'utf8');
        this.enrollments = JSON.parse(data);
        if (this.enrollments.length > 0) {
            this.idCounter = Math.max(...this.enrollments.map(u => u.id)) + 1;
        }
        }
    }
}
