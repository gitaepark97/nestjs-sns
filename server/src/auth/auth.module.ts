import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { HashingService } from 'src/util/hashing/hashing.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}
