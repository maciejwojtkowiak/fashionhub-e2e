export class Logger {
  public static info(context: string, details?: unknown): void {
    if (details === undefined) {
      console.info(`[info] ${context}`);
      return;
    }

    console.info(`[info] ${context}`, details);
  }

  public static warn(context: string, details: unknown): void {
    console.warn(`[warn] ${context}`, details);
  }
}
