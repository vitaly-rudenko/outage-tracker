export class Status {
  /**
   * @param {{
   *   id?: any,
   *   raw?: any,
   *   isOnline: boolean,
   *   createdAt: Date
   * }} input
   */
  constructor({ id, raw, isOnline, createdAt }) {
    if (id !== undefined) this.id = id
    if (raw !== undefined) this.raw = raw
    this.isOnline = isOnline
    this.createdAt = createdAt
  }
}