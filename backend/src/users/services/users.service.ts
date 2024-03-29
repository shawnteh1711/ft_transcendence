import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';
import { unlink } from 'fs';
import { StatService } from 'src/stat/services/stat.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly statService: StatService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    try {
      const dto = new CreateStatDto();
      const returnUser = await this.usersRepository.save(newUser);
      await this.statService.create(newUser, dto);
      return returnUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async getUsers() {
    return await this.usersRepository.find({
      relations: { stat: true },
    });
  }

  async findUsersById(id: number): Promise<User | null> {
    if (id === undefined) {
      return null;
    }
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new InternalServerErrorException('User not found');
    return user;
  }

  async findUsersByIntraId(intra_uid: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        intra_uid: intra_uid,
      },
    });
    if (!user) return null;
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async deleteUserById(id: number) {
    const user = await this.findUsersById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    try {
      const user = await this.findUsersById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      await this.usersRepository.delete(id);
      //   await this.achievementService.deleteUserAchvById(id);
    } catch (error) {
      console.log(error);
    }
  }

  async findUsersByName(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user)
      throw new NotFoundException(`User with username: ${username} not found`);
    return await user;
  }

  async deleteOriginalAvatar(avatar: string) {
    if (avatar) {
      const filename = avatar.split('/').pop();
      const filepath = `./public/avatar/${filename}`;
      unlink(filepath, (err) => {
        if (err) {
          console.log('Error deleting avatar file', err);
        }
      });
    }
  }

  async uploadAvatar(id: number, avatar: string) {
    try {
      const user = await this.findUsersById(id);
      const originalAvatar = user.avatar;
      this.deleteOriginalAvatar(originalAvatar);
      user.avatar = avatar;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Could not upload avatar');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No update data provided');
    }
    try {
      const updatedUserDto = {
        ...updateUserDto,
        updatedAt: new Date(),
      };
      await this.usersRepository.update(id, updatedUserDto);
      return await this.findUsersById(id);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation (duplicate key)
        throw new BadRequestException('Username already exists');
      } else if (error.name === 'EntityNotFound') {
        // Assuming TypeORM error for entity not found
        throw new BadRequestException('User not found');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Set authentication to true
  async authenticateUser(id: number) {
    await this.updateUser(id, {
      authentication: true,
    });
    // if ((await this.userAchievementService.checkExists(id, 1)) === false) {
    //   await this.userAchievementService.create({
    //     user: id,
    //     achievement: 1,
    //   });
    // }
  }

  async findUsersByIdWithRelation(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        relations: [
          'userAchievement',
          'userAchievement.achievement',
          'stat',
          'p1_match',
          'p1_match.p1',
          'p1_match.p2',
          'p2_match',
          'p2_match.p1',
          'p2_match.p2',
          'sentFriendRequest',
          'sentFriendRequest.receiver',
          'sentFriendRequest.sender',
          'receiveFriendRequest',
          'receiveFriendRequest.receiver',
          'receiveFriendRequest.sender',
          'sentGameInvitations',
          'sentGameInvitations.receiver',
          'receiveGameInvitations',
          'receiveGameInvitations.sender',
        ],
        where: {
          id: id,
        },
      });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      return await user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user', error);
    }
  }

  async turnAllUsersOffline() {
    await this.usersRepository.update({}, { online: false });
  }
}
