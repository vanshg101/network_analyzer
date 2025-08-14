import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
import userRouter from './routes/measure.routes.js'

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
});

app.use("/api/v1",userRouter)

export { app };
