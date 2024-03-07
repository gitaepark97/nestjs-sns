import { PostId } from 'src/post/domain/post';
import { Builder } from 'src/util/builder';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  readonly id: PostId;

  @Column()
  readonly content: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  static builder() {
    return new Builder(this);
  }
}
