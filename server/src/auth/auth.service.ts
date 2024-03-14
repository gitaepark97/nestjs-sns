import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/user';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/util/hashing/hashing.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const hashedPassword = await this.hashingService.hashPassword(dto.password);

    const user = User.builder()
      .set('username', dto.username)
      .set('hashedPassword', hashedPassword)
      .build();
    await this.userService.saveUser(user);
  }
}
