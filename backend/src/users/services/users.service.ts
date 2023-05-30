import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    console.log(newUser);
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  getUsers() {
    return this.usersRepository.find();
  }

  findUsersById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async deleteUserById(id: number) {
    return await this.usersRepository.delete(id);
  }

  async findUsersByName(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }
}
