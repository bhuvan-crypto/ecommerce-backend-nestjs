
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

// 🧪 The @Global() decorator enforces the Singleton behavior.
@Global() 
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Must be exported to be injected elsewhere
})
export class LoggerModule {}