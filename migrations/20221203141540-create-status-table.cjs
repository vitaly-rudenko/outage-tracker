module.exports = {
  /** @param {{ context: import('pg').Pool }} context */
  async up({ context: db }) {
    await db.query(`
      CREATE TABLE status (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR,
        is_online BOOLEAN,
        raw JSONB,
        created_at TIMESTAMPTZ
      );
    `)
  },

  /** @param {{ context: import('pg').Pool }} context */
  async down({ context: db }) {
    await db.query('DROP TABLE status;')
  },
}
