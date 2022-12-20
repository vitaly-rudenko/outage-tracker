export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message)
    this.code = 'RATE_LIMIT'
  }
}
