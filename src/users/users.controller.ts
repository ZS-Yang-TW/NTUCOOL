import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UpdateUserDto, CreateUserDto, QueryUserDto } from './user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    if (!this.isEmailValid(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    if (this.usersService.isEmailExist(email)) {
      throw new BadRequestException('Email already exists.');
    }

    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.findUserById(id);
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    return user;
  }

  @Get()
  async queryUsers(@Query() query: QueryUserDto) {
    const { email, name } = query;

    if (email && !this.isEmailValid(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    return this.usersService.queryUsers(email, name);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.findUserById(id);
    const { email } = updateUserDto;

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (email && !this.isEmailValid(email)) {
      throw new BadRequestException('Invalid email format.');
    }
    
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.findUserById(id);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return this.usersService.deleteUser(id);
  }

  // Email Validation
  private isEmailValid(email: string): boolean {
    var re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  }
}