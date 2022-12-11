export class Status {
  constructor({ id = undefined, raw = undefined, isOnline, createdAt }) {
    if (id !== undefined) this.id = id
    if (raw !== undefined) this.raw = raw
    this.isOnline = isOnline
    this.createdAt = createdAt
  }
}