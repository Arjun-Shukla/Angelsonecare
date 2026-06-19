/**
 * Application logger.
 *
 * Purpose: Centralized logging utility (swap console for winston/pino later
 * without touching call sites).
 *
 * TODO (implementation):
 *  - Configure transports & levels based on env.nodeEnv
 */

export const logger = {
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  debug: (...args) => console.debug(...args),
};
