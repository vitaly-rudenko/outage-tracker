export class Status {
  constructor({ id = undefined, raw = undefined, isOnline, createdAt }) {
    this.id = id
    this.raw = raw
    this.isOnline = isOnline
    this.createdAt = createdAt
  }
}