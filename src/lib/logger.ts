export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  tenantId?: string;
  companyId?: string;
  branchId?: string;
  userId?: string;
  traceId?: string;
  action?: string;
  entity?: string;
  [key: string]: unknown;
}

export class Logger {
  private service: string;

  constructor(service: string = "erp-boul") {
    this.service = service;
  }

  private write(level: LogLevel, message: string, context?: LogContext, error?: unknown): void {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      service: this.service,
      message,
      context,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    };

    if (level === "error") {
      console.error(JSON.stringify(payload));
    } else if (level === "warn") {
      console.warn(JSON.stringify(payload));
    } else {
      console.log(JSON.stringify(payload));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== "production") {
      this.write("debug", message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write("warn", message, context);
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    this.write("error", message, context, error);
  }
}

export const appLogger = new Logger("erp-boul-core");
