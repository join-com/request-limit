import { promisify } from 'util';

export const setTimeoutPromise = promisify(setTimeout);

export type LimitFn<T> = (...args: any[]) => Promise<T>;

export interface Logger {
  debug: (message: string) => void;
}

export class RequestLimit {
  private queriesCount = 0;

  constructor(
    readonly queriesLimit: number = 40,
    readonly queriesLimitTimeout: number = 2000,
    readonly retryTimeout: number = 1000,
    readonly logger?: Logger,
  ) {}

  public setLimit<T>(fn: LimitFn<T>): LimitFn<T> {
    return (...args) => {
      if (this.queriesCount >= this.queriesLimit) {
        return this.retryAfterTimeout(fn, ...args);
      }

      this.incrementQueriesCount();
      return fn(...args)
        .then(response => {
          this.scheduleQueriesCountDecrement();
          return response;
        })
        .catch(error => {
          this.scheduleQueriesCountDecrement();
          throw error;
        });
    };
  }

  private async scheduleQueriesCountDecrement() {
    await setTimeoutPromise(this.queriesLimitTimeout);
    await this.decrementQueriesCount();
  }

  private incrementQueriesCount() {
    this.queriesCount += 1;
    if (this.logger) {
      this.logger.debug(`Queries counter increased -> ${this.queriesCount}`);
    }
  }

  private decrementQueriesCount() {
    this.queriesCount -= 1;
    if (this.logger) {
      this.logger.debug(`Queries counter decreased -> ${this.queriesCount}`);
    }
  }

  private async retryAfterTimeout<T>(
    fn: LimitFn<T>,
    ...args: any[]
  ): Promise<T> {
    await setTimeoutPromise(this.retryTimeout);
    return this.setLimit(fn)(...args);
  }
}
