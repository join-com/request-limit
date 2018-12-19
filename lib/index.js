"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
exports.setTimeoutPromise = util_1.promisify(setTimeout);
class RequestLimit {
    constructor(queriesLimit = 40, queriesLimitTimeout = 2000, retryTimeout = 1000, logger) {
        this.queriesLimit = queriesLimit;
        this.queriesLimitTimeout = queriesLimitTimeout;
        this.retryTimeout = retryTimeout;
        this.logger = logger;
        this.queriesCount = 0;
    }
    setLimit(fn) {
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
    async scheduleQueriesCountDecrement() {
        await exports.setTimeoutPromise(this.queriesLimitTimeout);
        await this.decrementQueriesCount();
    }
    incrementQueriesCount() {
        this.queriesCount += 1;
        if (this.logger) {
            this.logger.debug(`Queries counter increased -> ${this.queriesCount}`);
        }
    }
    decrementQueriesCount() {
        this.queriesCount -= 1;
        if (this.logger) {
            this.logger.debug(`Queries counter decreased -> ${this.queriesCount}`);
        }
    }
    async retryAfterTimeout(fn, ...args) {
        await exports.setTimeoutPromise(this.retryTimeout);
        return this.setLimit(fn)(...args);
    }
}
exports.RequestLimit = RequestLimit;
//# sourceMappingURL=index.js.map