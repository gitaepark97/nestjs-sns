import { Post } from 'src/post/domain/post';
import { UserMapper } from 'src/user/persistence/mapper/user.mapper';
import { PostEntity } from '../entity/post.entity';

export abstract class PostMapper {
  static toEntity(domain: Post) {
    return PostEntity.builder()
      .set('id', domain.id)
      .set('user', UserMapper.toEntity(domain.user))
      .set('content', domain.content)
      .build();
  }

  static toDomain(entity: PostEntity) {
    return Post.builder()
      .set('id', entity.id)
      .set('user', UserMapper.toDomain(entity.user))
      .set('content', entity.content)
      .build();
  }

  static toDomains(entities: PostEntity[]) {
    return entities.map((entity) => PostMapper.toDomain(entity));
  }
}
