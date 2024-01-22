import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CoursesService],
  exports: [UsersService],
})
export class UsersModule {}
