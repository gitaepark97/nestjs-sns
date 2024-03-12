import { Injectable } from '@nestjs/common';
import { User } from './domain/user';
import { UserRepository } from './persistence/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserByUsername(username: string): Promise<User> {
    let user = await this.userRepository.findByUsername(username);
    if (!user) {
      user = User.builder().set('username', username).build();
      user = await this.userRepository.save(user);
    }
    return user;
  }
}
