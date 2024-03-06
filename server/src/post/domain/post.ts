import { Builder } from 'src/util/builder';

export class Post {
  readonly content: string;

  static builder() {
    return new Builder(this);
  }
}
