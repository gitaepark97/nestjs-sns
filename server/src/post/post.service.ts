import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Post, PostId } from './domain/post';
import { CreatePostDto } from './dto/create-post.dto';
import { ModifyPostDto } from './dto/modify-post.dto';
import { PostRepository } from './persistence/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
  ) {}

  async createPost(username: string, dto: CreatePostDto): Promise<Post> {
    const user = await this.userService.getUserByUsername(username);

    const post = Post.builder()
      .set('user', user)
      .set('content', dto.content)
      .build();
    return this.postRepository.save(post);
  }

  getPosts(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async getPost(postId: PostId): Promise<Post> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('해당 ID의 Post가 없습니다.');
    return post;
  }

  async modifyPost(
    postId: PostId,
    username: string,
    dto: ModifyPostDto,
  ): Promise<Post> {
    const post = await this.getPost(postId);

    if (username !== post.user.username)
      throw new ForbiddenException('작성자만 수정 가능합니다.');

    dto.content && post.changeContent(dto.content);
    return this.postRepository.save(post);
  }

  async deletePost(postId: PostId, username: string): Promise<void> {
    const post = await this.getPost(postId);

    if (username !== post.user.username)
      throw new ForbiddenException('작성자만 삭제 가능합니다.');

    await this.postRepository.delete(post.id);
  }
}
