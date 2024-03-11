import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'sns_local_user',
      password: 'sns_local_password',
      database: 'sns_local',
      entities:
        process.env.NODE_ENV === 'test'
          ? ['./**/entity/*.entity.ts']
          : ['./**/entity/*.entity.js'],
      synchronize: true,
      dropSchema: process.env.NODE_ENV === 'test',
    }),
  ],
})
export class ConfigModule {}
