import { UserId } from 'src/user/domain/user';
import { Builder } from 'src/util/builder';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  readonly id: UserId;

  @Column({ length: 20, unique: true })
  readonly username: string;

  @Column()
  readonly hashedPassword: string;

  static builder() {
    return new Builder(this);
  }
}
