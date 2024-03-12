import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PostModule, ConfigModule, UserModule],
})
export class AppModule {}
