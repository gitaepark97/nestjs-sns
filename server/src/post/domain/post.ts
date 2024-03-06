import { Builder } from 'src/util/builder';

export type PostId = number;

export class Post {
  readonly id: PostId;
  readonly content: string;

  static builder() {
    return new Builder(this);
  }
}
