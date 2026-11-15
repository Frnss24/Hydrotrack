import { BeverageModel } from "../models/beverageModel.js";

export const BeverageController = {
  async getAll(req, res) {
    try {
      const data = await BeverageModel.getAll();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await BeverageModel.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await BeverageModel.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
