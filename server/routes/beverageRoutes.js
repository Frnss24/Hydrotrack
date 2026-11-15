import express from "express";
import { BeverageController } from "../controllers/beverageController.js";

const router = express.Router();
router.get("/", BeverageController.getAll);
router.get("/:id", BeverageController.getById);
router.post("/", BeverageController.create);
export default router;
