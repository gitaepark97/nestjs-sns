import { Post } from './domain/post';

export class PostRepository {
  private readonly posts: Post[] = [];

  async save(post: Post) {
    this.posts.push(post);
    return post;
  }
}
