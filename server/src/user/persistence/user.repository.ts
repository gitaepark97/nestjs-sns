import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserId } from '../domain/user';
import { UserEntity } from './entity/user.entity';
import { UserMapper } from './mapper/user.mapper';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.userEntityRepository.save(entity);
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.userEntityRepository.findOne({
      where: { username },
    });
    return entity && UserMapper.toDomain(entity);
  }

  async findById(userId: UserId): Promise<User | null> {
    const entity = await this.userEntityRepository.findOne({
      where: { id: userId },
    });
    return entity && UserMapper.toDomain(entity);
  }
}
