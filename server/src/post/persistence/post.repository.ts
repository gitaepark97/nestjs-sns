import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostId } from '../domain/post';
import { PostEntity } from './entity/post.entity';
import { PostMapper } from './mapper/post.mapper';

export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
  ) {}

  async save(post: Post): Promise<Post> {
    let entity = PostMapper.toEntity(post);
    entity = await this.postEntityRepository.save(entity);
    return PostMapper.toDomain(entity);
  }

  async findAll(): Promise<Post[]> {
    const entities = await this.postEntityRepository.find({
      relations: ['user'],
    });
    return PostMapper.toDomains(entities);
  }

  async findById(postId: PostId): Promise<Post | null> {
    const entity = await this.postEntityRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    return entity && PostMapper.toDomain(entity);
  }

  async delete(postId: PostId): Promise<void> {
    await this.postEntityRepository.delete(postId);
  }
}
