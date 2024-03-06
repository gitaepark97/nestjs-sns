import { Injectable } from '@nestjs/common';
import { Post } from './domain/post';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  createPost(dto: CreatePostDto): Promise<Post> {
    const post = Post.builder().set('content', dto.content).build();
    return this.postRepository.save(post);
  }
}
