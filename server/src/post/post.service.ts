import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostId } from './domain/post';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './persistence/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  createPost(dto: CreatePostDto): Promise<Post> {
    const post = Post.builder().set('content', dto.content).build();
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
}
