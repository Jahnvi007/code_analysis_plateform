/* backend/src/app.js */
import express from "express";
import cors from "cors";
import problemRoutes from "./routes/problem.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import comparisonRoutes from "./routes/comparison.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

/* 🌍 GLOBAL logger */
app.use((req, res, next) => {
  console.log("🌍 GLOBAL:", req.method, req.originalUrl);
  next();
});

app.use(cors());
app.use(express.json());

// health check
app.get("/ping", (req, res) => {
  res.send("Server is alive");
});

// PUBLIC routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

// PROTECTED routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/comparison", comparisonRoutes);

// ❗ protectedRoutes LAST (if needed)
app.use("/api", protectedRoutes);

// error handlers LAST
app.use(notFound);
app.use(errorHandler);

export default app;
