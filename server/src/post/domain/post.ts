import { Builder } from 'src/util/builder';
import { User } from '../../user/domain/user';

export type PostId = number;

export class Post {
  readonly id: PostId;
  readonly user: User;
  content: string;

  static builder() {
    return new Builder(this);
  }

  changeContent(content: string) {
    this.content = content;
  }
}
