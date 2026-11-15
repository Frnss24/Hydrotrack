import { pool } from "../config/db.js";

export const LogModel = {
  async getAll(userIdentifier) {
    if (userIdentifier) {
      const { rows } = await pool.query(
        "SELECT * FROM hydration_logs WHERE user_identifier = $1 ORDER BY consumed_at DESC",
        [userIdentifier]
      );
      return rows;
    }
    const { rows } = await pool.query(
      "SELECT * FROM hydration_logs ORDER BY consumed_at DESC"
    );
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM hydration_logs WHERE id = $1",
      [id]
    );
    if (!rows[0]) {
      const err = new Error("Log not found");
      err.status = 404;
      throw err;
    }
    return rows[0];
  },

  async create(payload) {
    const {
      user_identifier,
      beverage_name,
      category = "Air Mineral",
      amount_ml,
      consumed_at = new Date().toISOString(),
      mood = "Segar",
      notes = null,
    } = payload;

    const { rows } = await pool.query(
      `INSERT INTO hydration_logs (
        user_identifier, beverage_name, category, amount_ml, consumed_at, mood, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        user_identifier,
        beverage_name,
        category,
        amount_ml,
        consumed_at,
        mood,
        notes,
      ]
    );
    return rows[0];
  },

  async update(id, payload) {
    const allowedFields = [
      "beverage_name",
      "category",
      "amount_ml",
      "consumed_at",
      "mood",
      "notes",
    ];
    const entries = Object.entries(payload).filter(
      ([key, value]) => allowedFields.includes(key) && value !== undefined
    );

    if (entries.length === 0) {
      return this.getById(id);
    }

    const setClauses = entries.map(([key], idx) => `${key} = $${idx + 1}`);
    const values = entries.map(([, value]) => value);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE hydration_logs SET ${setClauses.join(", ")} WHERE id = $${
        values.length
      } RETURNING *`,
      values
    );

    if (!rows[0]) {
      const err = new Error("Log not found");
      err.status = 404;
      throw err;
    }
    return rows[0];
  },

  async remove(id) {
    await pool.query("DELETE FROM hydration_logs WHERE id = $1", [id]);
    return { message: "Log deleted successfully" };
  },
};
