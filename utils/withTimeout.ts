export const COUPON_FETCH_TIMEOUT_MS = 15_000;

export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Rejects when `promise` does not settle within `ms`.
 * `cancel` clears the timer; the original promise is left untouched.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): {
  promise: Promise<T>;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const wrapped = new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(ms));
    }, ms);

    promise.then(
      (value) => {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        reject(error);
      },
    );
  });

  return {
    promise: wrapped,
    cancel: () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    },
  };
}
