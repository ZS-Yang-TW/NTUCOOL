import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto, CreateUserDto} from './user.dto';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;
  private readonly dataFile = 'users.json';

  // Initialize the service by loading the users from the DB
  constructor() {
    this.loadUsers();
  }

  // API Logic
  createUser(createUserDto: CreateUserDto): User {
    let user = new User();
    user.id = this.idCounter++;
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    this.users.push(user);
    this.saveUsers();
    return user;
  }

  queryUsers(email?: string, name?: string): User[] {
    return this.users.filter(user => {
      if (email && user.email !== email) {
        return false;
      }

      if (name && user.name !== name) {
        return false; 
      }

      return true;
    });
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): User | undefined {
    let user = this.findUserById(Number(id));
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    
    this.saveUsers();
    return user;
  }

  deleteUser(id: number): User {
    let index = this.users.findIndex(user => user.id === id);
    let user = this.users.splice(index, 1)[0];
    this.saveUsers();

    return user;
  }
  
  // Find User by ID
  findUserById(id: number): User {
    let user = this.users.find(user => user.id === id);
    return user;
  }

  findUsersByCourseId(courseId: number): User[] {
    let enrollments = new EnrollmentsService().findEnrollmentsByCourseId(courseId);
    let users = enrollments.map(enrollment => enrollment.user);
    return users
  }

  // Email Existence Check
  isEmailExist(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  // DB Save & Load
  private saveUsers(): void {
    fs.writeFileSync(this.dataFile, JSON.stringify(this.users));
  }

  private loadUsers(): void {
    if (fs.existsSync(this.dataFile)) {
      let data = fs.readFileSync(this.dataFile, 'utf8');
      this.users = JSON.parse(data);
      if (this.users.length > 0) {
        this.idCounter = Math.max(...this.users.map(u => u.id)) + 1;
      }
    }
  }
}