import { AlreadyExistsError } from './AlreadyExistsError.js'
import { Status } from './Status.js'

export class StatusPostgresStorage {
  /** @param {import('pg').Client} client */
  constructor(client) {
    this._client = client
  }

  /** @param {Status} status */
  async storeStatus(status) {
    try {
      const response = await this._client.query(`
        INSERT INTO status (is_online, raw, created_at)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          status.isOnline,
          status.raw ? JSON.stringify(status.raw) : null,
          status.createdAt,
        ]
      )

      return this.findById(response.rows[0]['id'])
    } catch (error) {
      if (String(error.code) === '23505') {
        throw new AlreadyExistsError()
      } else {
        throw error
      }
    }
  }

  async getLatestStatus() {
    const results = await this._find({ limit: 1, sort: 'descending' })
    return results[0]
  }

  async getDailyStatuses({ date }) {
    const minDate = new Date(date)
    minDate.setHours(0)
    minDate.setMinutes(0)
    minDate.setMilliseconds(0)

    const maxDate = new Date(date)
    maxDate.setDate(date.getDate() + 1)
    maxDate.setHours(0)
    maxDate.setMinutes(0)
    maxDate.setMilliseconds(0)

    return this._find({
      minDate,
      maxDate,
      sort: 'ascending',
    })
  }

  async getLatestStatusBeforeDate({ date }) {
    const maxDate = new Date(date)
    maxDate.setHours(0)
    maxDate.setMinutes(0)
    maxDate.setMilliseconds(0)

    const results = await this._find({
      maxDate,
      limit: 1,
      sort: 'descending',
    })

    return results[0]
  }

  /** @param {string} id */
  async findById(id) {
    const results = await this._find({ ids: [id], limit: 1 })
    return results[0]
  }

  /**
   * @param {{
   *   ids?: string[],
   *   minDate?: Date,
   *   maxDate?: Date,
   *   limit?: number,
   *   offset?: number,
   *   sort?: 'ascending' | 'descending'
   * }} options
   */
  async _find({ ids, minDate, maxDate, limit, offset, sort } = {}) {
    const conditions = []
    const variables = []

    if (ids && Array.isArray(ids)) {
      if (ids.length === 0) {
        throw new Error('"ids" cannot be empty')
      }

      conditions.push(
        `s.id IN (${ids
          .map((_, i) => `$${variables.length + i + 1}`)
          .join(', ')})`
      )
      variables.push(...ids)
    }

    if (minDate) {
      conditions.push(`s.created_at >= $${variables.length}`)
      variables.push(minDate)
    }

    if (maxDate) {
      conditions.push(`s.created_at < $${variables.length}`)
      variables.push(maxDate)
    }

    if (conditions.length === 0) {
      throw new Error('No conditions were provided for the search')
    }

    const whereClause =
      conditions.length > 0 ? `WHERE (${conditions.join(') AND (')})` : ''
    const paginationClause = [
      Number.isInteger(limit) && `LIMIT ${limit}`,
      Number.isInteger(offset) && `OFFSET ${offset}`,
    ]
      .filter(Boolean)
      .join(' ')

    const response = await this._client.query(
      `
        SELECT s.id, s.is_online, s.raw, s.created_at
        FROM status s ${whereClause}
        ORDER BY created_at ${
          sort === 'ascending' ? 'ASC' : 'DESC'
        } ${paginationClause};
      `,
      variables
    )

    return response.rows.map((row) => this.deserializeStatus(row))
  }

  deserializeStatus(row) {
    return new Status({
      id: row['id'],
      isOnline: row['is_online'],
      raw: row['raw'],
      createdAt: new Date(row['created_at']),
    })
  }
}