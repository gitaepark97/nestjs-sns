import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [PostModule, ConfigModule],
})
export class AppModule {}
