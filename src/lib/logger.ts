type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  message: string;
  context?: string;
  error?: unknown;
  [key: string]: unknown;
};

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { value: String(error) };
}

function writeLog(level: LogLevel, payload: LogPayload) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...payload,
    ...(payload.error ? { error: serializeError(payload.error) } : {}),
  };

  const line = JSON.stringify(entry);

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

export const logger = {
  info: (payload: LogPayload) => writeLog("info", payload),
  warn: (payload: LogPayload) => writeLog("warn", payload),
  error: (payload: LogPayload) => writeLog("error", payload),
};
