import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UpdateUserDto, CreateUserDto, QueryUserDto } from './user.dto';
import { UsersService } from './users.service';
import { CoursesService } from 'src/courses/courses.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly courseService: CoursesService,
    ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    let { email } = createUserDto;
    if (!this.isEmailValid(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    if (this.usersService.isEmailExist(email)) {
      throw new BadRequestException('Email already exists.');
    }

    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    let user = this.usersService.findUserById(id);
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    return user;
  }

  @Get()
  queryUsers(@Query() query: QueryUserDto) {
    let { email, name } = query;

    if (email && !this.isEmailValid(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    return this.usersService.queryUsers(email, name);
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    let user = this.usersService.findUserById(id);
    let { email } = updateUserDto;

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (email && !this.isEmailValid(email)) {
      throw new BadRequestException('Invalid email format.');
    }
    
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    let user = this.usersService.findUserById(id);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return this.usersService.deleteUser(id);
  }

  //users/{userId}/courses
  @Get(':id/courses')
  getCoursesByUserId(@Param('id', ParseIntPipe) id: number) {
    let user = this.usersService.findUserById(id);
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    return this.courseService.findCoursesByUserId(id);
  }
  
  // Email Validation
  private isEmailValid(email: string): boolean {
    let re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  }
}