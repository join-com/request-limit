/// <reference types="node" />
export declare const setTimeoutPromise: typeof setTimeout.__promisify__;
export declare type LimitFn<T> = (...args: any[]) => Promise<T>;
export interface Logger {
  debug: (message: string) => void;
}
export declare class RequestLimit {
  readonly queriesLimit: number;
  readonly queriesLimitTimeout: number;
  readonly retryTimeout: number;
  readonly logger?: Logger | undefined;
  private queriesCount;
  constructor(
    queriesLimit?: number,
    queriesLimitTimeout?: number,
    retryTimeout?: number,
    logger?: Logger | undefined,
  );
  setLimit<T>(fn: LimitFn<T>): LimitFn<T>;
  private scheduleQueriesCountDecrement;
  private incrementQueriesCount;
  private decrementQueriesCount;
  private retryAfterTimeout;
}
