import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
  import { UsersService } from 'src/users/services/users.service';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly userService: UsersService) {}
  
    @Get()
    getUsers() {
      return this.userService.getUsers();
    }

    @Get('id/:id')
    findUsersById(@Param('id', ParseIntPipe) id: number) {
      return this.userService.findUsersById(id);
    }
  
    // @Post('create')
    // @UsePipes(ValidationPipe)
    // createUsers(@Body() createUserDto: CreateUserDto) {
    //   return this.userService.createUser(createUserDto);
    // }

    @Post('create')
    @UsePipes(ValidationPipe)
    async createUsers(@Body() createUserDto: CreateUserDto) {
      return await this.userService.createUser(createUserDto);
    }
  }
