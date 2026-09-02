/**
 * Reads an environment variable, falling back to a default.
 *
 * @param key - Environment variable name.
 * @param fallback - Value to use when the variable is unset or empty.
 * @returns The resolved value.
 */
function env(key: string, fallback: string): string {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
}

export const config = {
  /** Port the Express server binds to. */
  port: Number(env('PORT', '3000')),
  /** Pino log level. */
  logLevel: env('LOG_LEVEL', 'info'),
  /** Runtime environment name. */
  nodeEnv: env('NODE_ENV', 'development'),
} as const;
