import { User } from 'src/user/domain/user';
import { UserEntity } from '../entity/user.entity';

export abstract class UserMapper {
  static toEntity(domain: User) {
    return UserEntity.builder()
      .set('id', domain.id)
      .set('username', domain.username)
      .set('hashedPassword', domain.hashedPassword)
      .build();
  }

  static toDomain(entity: UserEntity) {
    return User.builder()
      .set('id', entity.id)
      .set('username', entity.username)
      .set('hashedPassword', entity.hashedPassword)
      .build();
  }
}
