import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { User } from 'src/user/domain/user';
import { UserEntity } from 'src/user/persistence/entity/user.entity';
import { UserRepository } from 'src/user/persistence/user.repository';
import { Post, PostId } from '../domain/post';
import { PostEntity } from './entity/post.entity';
import { PostRepository } from './post.repository';

export class MockPostRepository {
  private readonly posts: Post[] = [];

  async save(post: Post): Promise<Post> {
    if (!post.id) {
      const newPost = Post.builder()
        .set('id', this.posts.length + 1)
        .set('user', post.user)
        .set('content', post.content)
        .build();
      this.posts.push(newPost);

      return newPost;
    } else {
      let existPost = this.posts.filter((val) => val.id === post.id)[0];
      existPost = Object.assign(existPost, post);

      return existPost;
    }
  }

  async findAll(): Promise<Post[]> {
    return this.posts;
  }

  async findById(postId: PostId): Promise<Post | null> {
    return this.posts.filter((post) => post.id === postId)[0] || null;
  }

  async delete(postId: PostId): Promise<void> {
    this.posts.filter((post) => post.id !== postId);
  }
}

describe('PostRepository', () => {
  let repository: PostRepository;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        TypeOrmModule.forFeature([UserEntity, PostEntity]),
      ],
      providers: [UserRepository, PostRepository],
    }).compile();

    repository = module.get<PostRepository>(PostRepository);
    const userRepository = module.get<UserRepository>(UserRepository);

    user = User.builder().set('username', 'username').build();
    user = await userRepository.save(user);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('success', async () => {
      // given
      const post = Post.builder()
        .set('user', user)
        .set('content', 'content')
        .build();

      // when
      const result = await repository.save(post);

      // then
      expect(result.id).toEqual(expect.any(Number));
      expect(result.user).toEqual(user);
      expect(result.content).toBe(post.content);
    });
  });

  describe('findAll', () => {
    it('', async () => {
      // given
      const count = 10;
      const posts = [];
      for (let i = 1; i <= count; i++) {
        posts.push(
          Post.builder()
            .set('user', user)
            .set('content', `content${i}`)
            .build(),
        );
      }
      await Promise.all(posts.map((post) => repository.save(post)));

      // when
      const result = await repository.findAll();

      // then
      expect(result.length).toBe(count);
      result.forEach((post) => {
        expect(post.id).toEqual(expect.any(Number));
        expect(post.user).toEqual(user);
        expect(post.content).toEqual(expect.any(String));
      });
    });
  });

  describe('findById', () => {
    it('success post', async () => {
      // given
      const post = await repository.save(
        Post.builder().set('user', user).set('content', 'content').build(),
      );

      // when
      const result = await repository.findById(post.id);

      // then
      expect(result).toBeDefined();
      expect(result!.id).toBe(post.id);
      expect(result!.user).toEqual(user);
      expect(result!.content).toBe(post.content);
    });

    it('success null', async () => {
      // given

      // when
      const result = await repository.findById(0);

      // then
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('success', async () => {
      // given
      const post = await repository.save(
        Post.builder().set('user', user).set('content', 'content').build(),
      );

      // when
      await repository.delete(post.id);

      // then
    });
  });
});
