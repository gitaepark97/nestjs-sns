import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { MockUserService } from 'src/user/user.service.spec';
import { CreatePostDto } from './dto/create-post.dto';
import { ModifyPostDto } from './dto/modify-post.dto';
import { PostRepository } from './persistence/post.repository';
import { MockPostRepository } from './persistence/post.repository.spec';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: PostRepository, useClass: MockPostRepository },
        PostService,
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('success', async () => {
      // given
      const userId = 1;
      const dto: CreatePostDto = {
        content: 'content',
      };

      // when
      const result = await service.createPost(userId, dto);

      // then
      expect(result.id).toEqual(expect.any(Number));
      expect(result.user.id).toBe(userId);
      expect(result.user.username).toEqual(expect.any(String));
      expect(result.user.hashedPassword).toEqual(expect.any(String));
      expect(result.content).toBe(dto.content);
    });
  });

  describe('getPosts', () => {
    it('success', async () => {
      // given
      const userId = 1;
      const count = 10;
      const dtos: CreatePostDto[] = [];
      for (let i = 1; i <= count; i++) {
        dtos.push({ content: `content${i}` });
      }
      await Promise.all(dtos.map((dto) => service.createPost(userId, dto)));

      // when
      const result = await service.getPosts();

      // then
      expect(result.length).toBe(count);
      result.forEach((post) => {
        expect(post.id).toEqual(expect.any(Number));
        expect(post.user.id).toBe(userId);
        expect(post.user.username).toEqual(expect.any(String));
        expect(post.user.hashedPassword).toEqual(expect.any(String));
        expect(post.user.hashedPassword).toEqual(expect.any(String));
        expect(post.content).toEqual(expect.any(String));
      });
    });
  });

  describe('getPost', () => {
    it('success', async () => {
      // given
      const userId = 1;
      const post = await service.createPost(userId, { content: 'content' });

      // when
      const result = await service.getPost(post.id);

      // then
      expect(result.id).toBe(post.id);
      expect(result.user.id).toBe(userId);
      expect(result.user.username).toEqual(expect.any(String));
      expect(result.user.hashedPassword).toEqual(expect.any(String));
      expect(result.content).toBe(post.content);
    });

    it('not found post', async () => {
      // given

      // when
      await expect(async () => await service.getPost(0)).rejects.toThrow(
        '해당 ID의 Post가 없습니다.',
      );

      // then
    });
  });

  describe('modifyPost', () => {
    it('success modify nothing', async () => {
      // given
      const userId = 1;
      const post = await service.createPost(userId, { content: 'content' });
      const dto: ModifyPostDto = {};

      // when
      const result = await service.modifyPost(post.id, userId, dto);

      // then
      expect(result.id).toBe(post.id);
      expect(result.user.id).toBe(userId);
      expect(result.user.username).toEqual(expect.any(String));
      expect(result.user.hashedPassword).toEqual(expect.any(String));
      expect(result.content).toBe(post.content);
    });

    it('success modify content', async () => {
      // given
      const userId = 1;
      const post = await service.createPost(userId, { content: 'content' });
      const dto: ModifyPostDto = { content: 'modified content' };

      // when
      const result = await service.modifyPost(post.id, userId, dto);

      // then
      expect(result.id).toBe(post.id);
      expect(result.user.id).toBe(userId);
      expect(result.user.username).toEqual(expect.any(String));
      expect(result.user.hashedPassword).toEqual(expect.any(String));
      expect(result.content).toBe(dto.content);
    });

    it('not found post', async () => {
      // given
      const dto: ModifyPostDto = {};

      // when
      await expect(
        async () => await service.modifyPost(0, 1, dto),
      ).rejects.toThrow('해당 ID의 Post가 없습니다.');

      // then
    });

    it('forbidden', async () => {
      // given
      const post = await service.createPost(1, { content: 'content' });
      const dto: ModifyPostDto = {};

      // when
      await expect(
        async () => await service.modifyPost(post.id, 0, dto),
      ).rejects.toThrow('작성자만 수정 가능합니다.');

      // then
    });
  });

  describe('modifyPost', () => {
    it('success', async () => {
      // given
      const userId = 1;
      const post = await service.createPost(userId, { content: 'content' });

      // when
      await service.deletePost(post.id, userId);

      // then
    });

    it('not found post', async () => {
      // given

      // when
      await expect(async () => await service.deletePost(0, 1)).rejects.toThrow(
        '해당 ID의 Post가 없습니다.',
      );

      // then
    });

    it('forbidden', async () => {
      // given
      const post = await service.createPost(1, { content: 'content' });

      // when
      await expect(
        async () => await service.deletePost(post.id, 0),
      ).rejects.toThrow('작성자만 삭제 가능합니다.');

      // then
    });
  });
});
