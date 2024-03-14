import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserId } from './domain/user';
import { UserRepository } from './persistence/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async saveUser(user: User): Promise<void> {
    await this.checkUsernameConflict(user.username);

    await this.userRepository.save(user);
  }

  async getUser(userId: UserId): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('해당 ID의 User가 없습니다.');
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new NotFoundException('해당 username의 User가 없습니다.');
    return user;
  }

  private async checkUsernameConflict(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);
    if (user) throw new ConflictException('이미 사용 중인 username입니다.');
  }
}
