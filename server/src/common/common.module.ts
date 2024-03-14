import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './exception/all-exception.filter';

@Module({
  providers: [AllExceptionsFilter],
})
export class CommonModule {}
