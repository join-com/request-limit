## request-limit

Limits number of executed requests made per time frame

### Usage
```ts
import { RequestLimit } from '@join-com/request-limit'

const REQUESTS_LIMIT = 5 // Max number of requests can be executed during specific time frame
const REQUESTS_LIMIT_TIMEOUT = 10000 // Time frame in ms for which number of requests can be executed is limited
const RETRY_TIMEOUT = 1000 // Timeout in ms after which not executed requests will be re-scheduled

// Create an instance
const requestLimit = new RequestLimit(REQUESTS_LIMIT, REQUESTS_LIMIT_TIMEOUT, RETRY_TIMEOUT)

// Function will be limited to 5 requests per 10 seconds
const request = requestLimit.setLimit(
  () => { // Do something }
)
```
