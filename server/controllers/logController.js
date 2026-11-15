import { LogModel } from "../models/logModel.js";

export const LogController = {
  async getAll(req, res) {
    try {
      const data = await LogModel.getAll(req.query.user_identifier);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await LogModel.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const payload = {
        user_identifier: req.body.user_identifier || "anon",
        beverage_name: req.body.beverage_name || "Air Mineral",
        category: req.body.category || "Air Murni",
        amount_ml: Number(req.body.amount_ml) || 250,
        consumed_at: req.body.consumed_at || new Date().toISOString(),
        mood: req.body.mood || "Segar",
        notes: req.body.notes || "",
      };
      const data = await LogModel.create(payload);
      res.status(201).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await LogModel.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await LogModel.remove(req.params.id);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
