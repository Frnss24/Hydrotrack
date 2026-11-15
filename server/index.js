import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { isDatabaseConfigured } from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import beverageRoutes from "./routes/beverageRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    success: true,
    name: "HydroTrack API – Daily Hydration Tracker",
    version: "1.0.0",
    database: "Neon PostgreSQL",
    databaseConfigured: isDatabaseConfigured,
    endpoints: ["/api/categories", "/api/beverages", "/api/logs"],
  });
});

app.use("/api", (req, res, next) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({
      success: false,
      message:
        "Database Neon belum dikonfigurasi. Isi DATABASE_URL di file .env.",
    });
  }
  next();
});

app.use("/api/categories", categoryRoutes);
app.use("/api/beverages", beverageRoutes);
app.use("/api/logs", logRoutes);

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`HydroTrack API running on http://localhost:${port}`);
  });
}

export default app;
