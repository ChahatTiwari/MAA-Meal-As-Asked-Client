// utils/logger.ts
// Centralized logging utility

import { env } from '../config/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  tag?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private enabled = env.features.enableLogging;
  private minLevel: LogLevel = __DEV__ ? 'debug' : 'info';

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    
    return levels[level] >= levels[this.minLevel];
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, tag?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      tag,
    };

    this.logs.push(entry);
    
    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with formatting
    const prefix = tag ? `[${tag}]` : '';
    const timestamp = new Date(entry.timestamp).toISOString();
    
    switch (level) {
      case 'debug':
        console.debug(`🔍 ${timestamp} ${prefix} ${message}`, context || '');
        break;
      case 'info':
        console.info(`ℹ️ ${timestamp} ${prefix} ${message}`, context || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${timestamp} ${prefix} ${message}`, context || '');
        break;
      case 'error':
        console.error(`❌ ${timestamp} ${prefix} ${message}`, context || '');
        break;
    }
  }

  debug(message: string, context?: Record<string, any>, tag?: string): void {
    this.log('debug', message, context, tag);
  }

  info(message: string, context?: Record<string, any>, tag?: string): void {
    this.log('info', message, context, tag);
  }

  warn(message: string, context?: Record<string, any>, tag?: string): void {
    this.log('warn', message, context, tag);
  }

  error(message: string, context?: Record<string, any>, tag?: string): void {
    this.log('error', message, context, tag);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, { data }, 'API');
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, data?: any): void {
    this.debug(`API Response: ${method} ${url} - ${status}`, { data }, 'API');
  }

  /**
   * Log API error
   */
  apiError(method: string, url: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, { error: error?.message || error }, 'API');
  }

  /**
   * Log navigation
   */
  navigation(from: string, to: string, params?: any): void {
    this.info(`Navigation: ${from} → ${to}`, { params }, 'NAV');
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, context, 'USER');
  }

  /**
   * Log performance timing
   */
  timing(label: string, duration: number, context?: Record<string, any>): void {
    this.debug(`Timing: ${label} took ${duration}ms`, { duration, ...context }, 'PERF');
  }

  /**
   * Get recent logs
   */
  getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter(log => log.level === level);
    }
    return filtered.slice(-limit);
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Export logs for debugging
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Singleton instance
export const logger = new Logger();

export default logger;