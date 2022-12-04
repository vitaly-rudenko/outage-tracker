module.exports = {
  /** @param {{ context: import('pg').Pool }} context */
  async up({ context: db }) {
    await db.query(`
      CREATE TABLE status (
        id SERIAL PRIMARY KEY,
        is_online BOOLEAN NOT NULL,
        raw JSONB,
        created_at TIMESTAMPTZ NOT NULL
      );
    `)
  },

  /** @param {{ context: import('pg').Pool }} context */
  async down({ context: db }) {
    await db.query('DROP TABLE status;')
  },
}
