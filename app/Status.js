export class Status {
  constructor({ raw, userId, isOnline, createdAt }) {
    this.raw = raw
    this.userId = userId
    this.isOnline = isOnline
    this.createdAt = createdAt
  }
}