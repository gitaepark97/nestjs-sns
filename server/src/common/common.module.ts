import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exception.filter';

@Module({
  providers: [AllExceptionsFilter],
})
export class CommonModule {}
