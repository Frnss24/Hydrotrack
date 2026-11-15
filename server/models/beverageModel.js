import { pool } from "../config/db.js";

const BEVERAGE_SELECT = `
  SELECT
    b.*,
    CASE
      WHEN c.id IS NOT NULL THEN json_build_object('id', c.id, 'name', c.name)
      ELSE NULL
    END AS beverage_categories
  FROM beverages b
  LEFT JOIN beverage_categories c ON b.category_id = c.id
`;

export const BeverageModel = {
  async getAll() {
    const { rows } = await pool.query(
      `${BEVERAGE_SELECT} ORDER BY b.hydration_index DESC`
    );
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query(`${BEVERAGE_SELECT} WHERE b.id = $1`, [
      id,
    ]);
    if (!rows[0]) {
      const err = new Error("Beverage not found");
      err.status = 404;
      throw err;
    }
    return rows[0];
  },

  async create(payload) {
    const {
      name,
      category_id = null,
      hydration_index = 100,
      recommended_ml = 250,
      calories_per_250ml = 0,
      best_time = "Sepanjang hari",
      description = null,
      benefits = [],
      tips = [],
    } = payload;

    const { rows } = await pool.query(
      `INSERT INTO beverages (
        name, category_id, hydration_index, recommended_ml,
        calories_per_250ml, best_time, description, benefits, tips
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)
      RETURNING id`,
      [
        name,
        category_id,
        hydration_index,
        recommended_ml,
        calories_per_250ml,
        best_time,
        description,
        JSON.stringify(benefits),
        JSON.stringify(tips),
      ]
    );

    return this.getById(rows[0].id);
  },
};
