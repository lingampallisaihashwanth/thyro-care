import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import bookingsRoutes from "./routes/bookings.routes";
import healthRoutes from "./routes/health.routes";
import notificationsRoutes from "./routes/notifications.routes";
import profilesRoutes from "./routes/profiles.routes";
import reportsRoutes from "./routes/reports.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  ...(env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [])
];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "THYRO LABORATORIES Backend Running"
  });
});

app.use("/health", healthRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
