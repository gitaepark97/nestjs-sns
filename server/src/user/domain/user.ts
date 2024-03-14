import { Builder } from 'src/util/builder';

export type UserId = number;

export class User {
  readonly id: UserId;
  readonly username: string;
  readonly hashedPassword: string;

  static builder() {
    return new Builder(this);
  }
}
