import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './post.repository';
import { MockPostRepository } from './post.repository.spec';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      const dto: CreatePostDto = {
        content: 'content',
      };

      // when
      const result = await service.createPost(dto);

      // then
      expect(result.content).toBe(dto.content);
    });
  });

  describe('createPost', () => {
    it('success', async () => {
      // given
      const dto: CreatePostDto = {
        content: 'content',
      };

      // when
      const result = await service.createPost(dto);

      // then
      expect(result.content).toBe(dto.content);
    });
  });

  describe('createPost', () => {
    it('success', async () => {
      // given
      const count = 10;
      const dtos: CreatePostDto[] = [];
      for (let i = 1; i <= count; i++) {
        dtos.push({ content: `content${i}` });
      }
      await Promise.all(dtos.map((dto) => service.createPost(dto)));

      // when
      const result = await service.getPosts();

      // then
      expect(result.length).toBe(count);
      result.forEach((post) => {
        expect(post.content).toEqual(expect.any(String));
      });
    });
  });
});
