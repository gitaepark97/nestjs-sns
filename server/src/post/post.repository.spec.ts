import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './domain/post';
import { PostRepository } from './post.repository';

export class MockPostRepository {
  private readonly posts: Post[] = [];

  async save(post: Post) {
    this.posts.push(post);
    return post;
  }

  async findAll() {
    return this.posts;
  }
}

describe('PostRepository', () => {
  let repository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostRepository],
    }).compile();

    repository = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('success', async () => {
      // given
      const post = Post.builder().set('content', 'content').build();

      // when
      const result = await repository.save(post);

      // then
      expect(result.content).toBe(post.content);
    });
  });

  describe('findAll', () => {
    it('', async () => {
      // given
      const count = 10;
      const posts = [];
      for (let i = 1; i <= count; i++) {
        posts.push(Post.builder().set('content', `content${i}`).build());
      }
      await Promise.all(posts.map((post) => repository.save(post)));

      // when
      const result = await repository.findAll();

      // then
      expect(result.length).toBe(count);
      result.forEach((post) => {
        expect(post.content).toEqual(expect.any(String));
      });
    });
  });
});
