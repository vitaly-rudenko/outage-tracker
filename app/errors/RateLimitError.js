export class RateLimitError extends Error {
  constructor(message = 'Rate limit reached') {
    super(message)
    this.code = 'RATE_LIMIT'
  }
}
