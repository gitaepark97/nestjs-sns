import { Post, PostId } from './domain/post';

export class PostRepository {
  private readonly posts: Post[] = [];

  async save(post: Post): Promise<Post> {
    const newPost = Post.builder()
      .set('id', this.posts.length + 1)
      .set('content', post.content)
      .build();
    this.posts.push(newPost);
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    return this.posts;
  }

  async findById(postId: PostId): Promise<Post | null> {
    return this.posts.filter((post) => post.id === postId)[0] || null;
  }
}
