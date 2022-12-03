module.exports = {
  /** @param {{ context: import('pg').Pool }} context */
  async up({ context: db }) {
    await db.query(`
      CREATE TABLE status (
        id SERIAL PRIMARY KEY,
        chat_id VARCHAR,
        is_online BOOLEAN,
        devices JSONB,
        created_at TIMESTAMPTZ
      );
    `)
  },

  /** @param {{ context: import('pg').Pool }} context */
  async down({ context: db }) {
    await db.query('DROP TABLE status;')
  },
}
