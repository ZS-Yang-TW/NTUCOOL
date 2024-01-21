import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;
  private readonly dataFile = 'users.json';

  constructor() {
    this.loadUsers();
  }

  createUser(createUserDto: CreateUserDto): User {
    const user = new User();
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
    const user = this.findById(Number(id));
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    
    this.saveUsers();
    return user;
  }

  deleteUser(id: number): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    const user = this.users.splice(index, 1)[0];
    this.saveUsers();

    return user;
  }
  
  // Find User by ID
  findById(id: number): User | undefined {
    const user = this.users.find(user => user.id === id);
    this.saveUsers();

    return user;
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
      const data = fs.readFileSync(this.dataFile, 'utf8');
      this.users = JSON.parse(data);
      if (this.users.length > 0) {
        this.idCounter = Math.max(...this.users.map(u => u.id)) + 1;
      }
    }
  }
}