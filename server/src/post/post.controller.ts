import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @Get()
  async getPosts() {
    const posts = await this.postService.getPosts();
    return { posts };
  }

  @Get(':postId')
  getPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPost(postId);
  }
}
