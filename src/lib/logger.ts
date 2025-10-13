/**
 * Edge Runtime Compatible Logger for Next.js API Routes
 *
 * Provides structured JSON logging compatible with Edge Runtime restrictions.
 * Use console.log/error for Edge Runtime compatibility (no Node.js APIs).
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

interface LogMetadata {
  correlation_id?: string;
  conversation_id?: string;
  user_sub?: string;
  [key: string]: any;
}

/**
 * Format log message as JSON for structured logging
 */
function formatLogMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
  const logData = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
  };

  return JSON.stringify(logData);
}

/**
 * Log info level message (for production use)
 */
export function logInfo(message: string, metadata?: LogMetadata): void {
  console.log(formatLogMessage('INFO', message, metadata));
}

/**
 * Log warning level message
 */
export function logWarning(message: string, metadata?: LogMetadata): void {
  console.warn(formatLogMessage('WARNING', message, metadata));
}

/**
 * Log error level message with optional error object
 */
export function logError(message: string, error?: Error, metadata?: LogMetadata): void {
  const errorMetadata = error
    ? {
        ...metadata,
        error_message: error.message,
        error_stack: error.stack,
      }
    : metadata;

  console.error(formatLogMessage('ERROR', message, errorMetadata));
}

/**
 * Log debug level message (only in development)
 */
export function logDebug(message: string, metadata?: LogMetadata): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(formatLogMessage('DEBUG', message, metadata));
  }
}

/**
 * Generate correlation ID for request tracing
 */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}
