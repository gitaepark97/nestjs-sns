import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { User, UserId } from '../domain/user';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';

export class MockUserRepository {
  private readonly users: User[] = [];

  async save(user: User): Promise<User> {
    const existUser = await this.findByUsername(user.username);
    if (existUser) throw Error();

    const newUser = User.builder()
      .set('id', this.users.length + 1)
      .set('username', user.username)
      .build();
    this.users.push(newUser);

    return newUser;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.filter((user) => user.username === username)[0] || null;
  }

  async findById(userId: UserId): Promise<User | null> {
    return this.users.filter((user) => user.id === userId)[0] || null;
  }
}

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('success', async () => {
      // given
      const user = User.builder().set('username', 'username').build();

      // when
      const result = await repository.save(user);

      // then
      expect(result.id).toEqual(expect.any(Number));
      expect(result.username).toBe(user.username);
    });
  });

  describe('findByUsername', () => {
    it('success user', async () => {
      // given
      const user = await repository.save(
        User.builder().set('username', 'username').build(),
      );

      // when
      const result = await repository.findByUsername(user.username);

      // then
      expect(result).toBeDefined();
      expect(result!.id).toBe(user.id);
      expect(result!.username).toBe(user.username);
    });

    it('success null', async () => {
      // given

      // when
      const result = await repository.findByUsername('wrong username');

      // then
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('success user', async () => {
      // given
      const user = await repository.save(
        User.builder().set('username', 'username').build(),
      );

      // when
      const result = await repository.findById(user.id);

      // then
      expect(result).toBeDefined();
      expect(result!.id).toBe(user.id);
      expect(result!.username).toBe(user.username);
    });

    it('success null', async () => {
      // given

      // when
      const result = await repository.findById(0);

      // then
      expect(result).toBeNull();
    });
  });
});
