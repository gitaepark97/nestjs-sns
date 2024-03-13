import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ModifyPostDto } from './dto/modify-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Query('username') username: string, @Body() body: CreatePostDto) {
    return this.postService.createPost(username, body);
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

  @Patch(':postId')
  modifyPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('username') username: string,
    @Body() body: ModifyPostDto,
  ) {
    return this.postService.modifyPost(postId, username, body);
  }

  @Delete(':postId')
  deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('username') username: string,
  ) {
    return this.postService.deletePost(postId, username);
  }
}
