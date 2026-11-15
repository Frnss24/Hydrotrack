import { CategoryModel } from "../models/categoryModel.js";

export const CategoryController = {
  async getAll(req, res) {
    try {
      const data = await CategoryModel.getAll();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Name is required" });
      }
      const data = await CategoryModel.create(name.trim());
      res.status(201).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await CategoryModel.remove(req.params.id);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
