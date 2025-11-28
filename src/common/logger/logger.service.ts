// 📁 src/common/logger/logger.service.ts

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
    // We extend the base Logger, which automatically handles timestamps and formatting.

    log(message: string, context?: string) {
        super.log(message, context); // ⬅️ Example: Log normal activity
    }

    error(message: string, trace?: string, context?: string) {
        super.error(message, trace, context); // ⬅️ Example: Log errors and stack traces
    }

    warn(message: string, context?: string) {
        super.warn(message, context);
    }
}