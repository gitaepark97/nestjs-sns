/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserId } from './domain/user';
import { UserRepository } from './persistence/user.repository';
import { MockUserRepository } from './persistence/user.repository.spec';
import { UserService } from './user.service';

export class MockUserService {
  async saveUser(user: User): Promise<void> {}

  async getUser(userId: UserId): Promise<User> {
    return User.builder()
      .set('id', userId)
      .set('username', 'username')
      .set('hashedPassword', 'hashedPassword')
      .build();
  }

  async getUserByUsername(username: string): Promise<User> {
    return User.builder()
      .set('id', 1)
      .set('username', username)
      .set('hashedPassword', 'hashedPassword')
      .build();
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UserRepository, useClass: MockUserRepository },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveUser', () => {
    it('success', async () => {
      // given
      const user = User.builder()
        .set('username', 'username')
        .set('hashedPassword', 'hashedPassword')
        .build();

      // when
      await service.saveUser(user);

      // then
    });

    it('username conflict', async () => {
      // given
      const user = User.builder()
        .set('username', 'username')
        .set('hashedPassword', 'hashedPassword')
        .build();
      await service.saveUser(user);

      // when
      await expect(async () => await service.saveUser(user)).rejects.toThrow(
        '이미 사용 중인 username입니다.',
      );

      // then
    });
  });

  describe('getUser', () => {
    it('success', async () => {
      // given
      const user = User.builder()
        .set('username', 'username')
        .set('hashedPassword', 'hashedPassword')
        .build();
      await service.saveUser(user);

      // when
      const result = await service.getUser(1);

      // then
      expect(result.id).toEqual(1);
      expect(result.username).toBe(user.username);
      expect(result.hashedPassword).toBe(user.hashedPassword);
    });

    it('not found user', async () => {
      // given

      // when
      await expect(async () => await service.getUser(0)).rejects.toThrow(
        '해당 ID의 User가 없습니다.',
      );

      // then
    });
  });

  describe('getUserByUsername', () => {
    it('success', async () => {
      // given
      const user = User.builder()
        .set('username', 'username')
        .set('hashedPassword', 'hashedPassword')
        .build();
      await service.saveUser(user);

      // when
      const result = await service.getUserByUsername(user.username);

      // then
      expect(result.id).toEqual(expect.any(Number));
      expect(result.username).toBe(user.username);
      expect(result.hashedPassword).toBe(user.hashedPassword);
    });

    it('not found user', async () => {
      // given

      // when
      await expect(
        async () => await service.getUserByUsername('wrong username'),
      ).rejects.toThrow('해당 username의 User가 없습니다.');

      // then
    });
  });
});
