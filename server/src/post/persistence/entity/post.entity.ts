import { PostId } from 'src/post/domain/post';
import { UserEntity } from 'src/user/persistence/entity/user.entity';
import { Builder } from 'src/util/builder';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  readonly id: PostId;

  @ManyToOne(() => UserEntity, { nullable: false })
  readonly user: UserEntity;

  @Column()
  readonly content: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  static builder() {
    return new Builder(this);
  }
}
