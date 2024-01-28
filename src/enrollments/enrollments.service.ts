import { Injectable } from '@nestjs/common';
import { Enrollment } from './enrollment.entity';
import { CreateEnrollmentsDto } from './enrollments.dto';
import * as fs from 'fs';


@Injectable()
export class EnrollmentsService {
    private enrollments: Enrollment[] = [];
    private idCounter = 1;
    private readonly dataFile = 'data/enrollments.json'

    // Initialize the service by loading the enrollments from the DB
    constructor() {
        this.loadEnrollments();
    }

    // CRUD Logic
    createEnrollment(enrollment: CreateEnrollmentsDto): Enrollment {
        let newEnrollment = {
            id: this.idCounter++,
            userId: enrollment.user,
            courseId: enrollment.course,
            role: enrollment.role,
        };
        this.enrollments.push(newEnrollment);
        this.saveEnrollments();
        return newEnrollment;
    }

    deleteEnrollment(id: number): Enrollment {
        let index = this.enrollments.findIndex(enrollment => enrollment.id === id);
        let enrollment = this.enrollments.splice(index, 1)[0];
        this.saveEnrollments();

        return enrollment;
    }

    // Inner Logic
    findEnrollmentById(id: number): Enrollment {
        let enrollment = this.enrollments.find(enrollment => enrollment.id === id);
        return enrollment
    }

    findEnrollmentsByUserId(userId: number): Enrollment[] {
        return this.enrollments.filter(enrollment => enrollment.userId === userId);
    }

    findEnrollmentsByCourseId(courseId: number): Enrollment[] {
        return this.enrollments.filter(enrollment => enrollment.courseId === courseId);
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
