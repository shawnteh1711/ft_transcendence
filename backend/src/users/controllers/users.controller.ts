import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('id/:id')
  async findUsersById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUsersById(id);
  }

  @Get('username/:username')
  async findUsersByName(@Param('username') username: string) {
    return await this.userService.findUsersByName(username);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    try {
      await this.userService.deleteUserById(id);
      return {
        message: 'User with id ${id} has been deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
