import { AlreadyExistsError } from '../errors/AlreadyExistsError.js'
import { Status } from './Status.js'

export class StatusPostgresStorage {
  /** @param {import('pg').Client} client */
  constructor(client) {
    this._client = client
  }

  /** @param {Status[]} statuses */
  async batchCreate(statuses) {
    await this._client.query(
      `
      INSERT INTO status (is_online, raw, created_at)
      VALUES ${statuses
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(', ')}
      RETURNING *;
      `,
      statuses.flatMap((status) => [
        status.isOnline,
        status.raw ? JSON.stringify(status.raw) : undefined,
        status.createdAt,
      ])
    )
  }

  /** @param {Status} status */
  async createStatus(status) {
    try {
      const response = await this._client.query(
        `
        INSERT INTO status (is_online, raw, created_at)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [
          status.isOnline,
          status.raw ? JSON.stringify(status.raw) : undefined,
          status.createdAt,
        ]
      )

      return this.deserializeStatus(response.rows[0])
    } catch (error) {
      if (String(error.code) === '23505') {
        throw new AlreadyExistsError()
      } else {
        throw error
      }
    }
  }

  async deleteAllStatuses() {
    await this._client.query(`
      DELETE FROM status;
    `)
  }

  /** @returns {Promise<Status | undefined>} */
  async findLatestStatusFirstChange() {
    const response = await this._client.query(`
      SELECT DISTINCT ON (sw.is_online)
        sw.id, sw.raw, sw.is_online, sw.created_at
      FROM (
        SELECT *,
          LAG(s.is_online) OVER (ORDER BY s.created_at ASC) prev_is_online
        FROM status s
      ) sw
      WHERE sw.prev_is_online IS NULL
        OR sw.is_online != sw.prev_is_online
      ORDER BY sw.is_online, sw.created_at DESC;
    `)

    const latestChangesPerStatus = response.rows.map(this.deserializeStatus)
    latestChangesPerStatus.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    return latestChangesPerStatus[0]
  }

  async findStatusesBetween({ startDateIncluding, endDateExcluding }) {
    return this._find({
      minDateIncluding: startDateIncluding,
      maxDateExcluding: endDateExcluding,
      sort: 'ascending',
    })
  }

  async findLatestStatusBefore(date) {
    const statuses = await this._find({
      maxDateExcluding: date,
      limit: 1,
      sort: 'descending',
    })

    return statuses[0]
  }

  /**
   * @param {{
   *   ids?: string[],
   *   isOnline?: boolean,
   *   minDateIncluding?: Date,
   *   maxDateExcluding?: Date,
   *   limit?: number,
   *   offset?: number,
   *   sort?: 'ascending' | 'descending'
   * }} options
   */
  async _find({
    ids,
    isOnline,
    minDateIncluding,
    maxDateExcluding,
    limit,
    offset,
    sort,
  } = {}) {
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

    if (isOnline !== undefined) {
      variables.push(isOnline)
      conditions.push(`s.is_online = $${variables.length}`)
    }

    if (minDateIncluding) {
      variables.push(minDateIncluding)
      conditions.push(`s.created_at >= $${variables.length}`)
    }

    if (maxDateExcluding) {
      variables.push(maxDateExcluding)
      conditions.push(`s.created_at < $${variables.length}`)
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

    return response.rows.map(this.deserializeStatus)
  }

  deserializeStatus = (row) => {
    return new Status({
      id: row['id'],
      isOnline: row['is_online'],
      raw: row['raw'],
      createdAt: new Date(row['created_at']),
    })
  }
}
