// Production-ready logger
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(prefix, message, ...args);
          break;
        case LogLevel.INFO:
          console.info(prefix, message, ...args);
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, ...args);
          break;
        case LogLevel.ERROR:
          console.error(prefix, message, ...args);
          break;
      }
    }
    // In production, you might want to send logs to a service like Sentry, LogRocket, etc.
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }
}

export const logger = new Logger();
