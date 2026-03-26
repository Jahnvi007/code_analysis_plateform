/* backend/src/app.js */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

// 🔒 Security headers
app.use(helmet());

// 🌍 CORS — only allow configured frontend origin
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : [];

if (allowedOrigins.length === 0) {
  console.warn(
    "⚠️  WARNING: FRONTEND_URL is not set. All browser cross-origin requests will be blocked. " +
    "Set FRONTEND_URL in your .env file (e.g. FRONTEND_URL=http://localhost:3000)."
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true
  })
);

// 🛡️ Global rate limiter — 200 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." }
});
app.use(globalLimiter);

/* 🌍 GLOBAL logger */
app.use((req, res, next) => {
  console.log("🌍 GLOBAL:", req.method, req.originalUrl);
  next();
});

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