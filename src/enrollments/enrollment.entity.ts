import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

export class Enrollment {
    id: number;
    user: User;
    course: Course;
    role: string; // 'student', 'teacher', etc.
  }