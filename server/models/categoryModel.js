import { pool } from "../config/db.js";

export const CategoryModel = {
  async getAll() {
    const { rows } = await pool.query(
      "SELECT id, name FROM beverage_categories ORDER BY name ASC"
    );
    return rows;
  },

  async create(name) {
    const { rows } = await pool.query(
      "INSERT INTO beverage_categories (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    return rows[0];
  },

  async remove(id) {
    await pool.query("DELETE FROM beverage_categories WHERE id = $1", [id]);
    return { message: "Category deleted successfully" };
  },
};
