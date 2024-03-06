import { Post } from './domain/post';

export class PostRepository {
  private readonly posts: Post[] = [];

  async save(post: Post) {
    const newPost = Post.builder()
      .set('id', this.posts.length + 1)
      .set('content', post.content)
      .build();
    this.posts.push(newPost);
    return newPost;
  }

  async findAll() {
    return this.posts;
  }
}
