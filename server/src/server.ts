import express, { Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import { connectMongoDB } from "./config/db";

import { authRouter } from "./routes/AuthRoutes";
import "./config/passport"; // i imported the passport config here... it will run when server get started.
import cors from "cors"
import { config } from "dotenv";
import MongoStore from "connect-mongo";
import postRouter from "./routes/PostRoutes";
import { authMiddleware } from "./middlewares/AuthMiddleware";
config({
  path:".env"
})
connectMongoDB();

const app = express();

// corss setup =>
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000","http://localhost:5173","https://socialmedia.frontend.yashstack.com"],
}))

// Middleware setup =>
app.use(express.json());
app.use(session({
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true, // for security
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // same-site behavior
  },
  store: MongoStore.create({
    mongoUrl : process.env.DATABASE_URL,
    collectionName: "sessions"
  })
}));

// Initialize Passport =>
app.use(passport.initialize());
app.use(passport.session());

const apiRouter = express.Router();

// global /api route prefix.
app.use("/api", apiRouter);

// and then attaching the feature specific routes prefixes.
apiRouter.use("/auth", authRouter);
apiRouter.use("/posts", authMiddleware, postRouter)

const PORT = 8000;
const DOMAIN = process.env.NODE_ENV === "production" ? "prod_url" : `http://localhost:${PORT}`

app.listen(PORT, () => {
  console.log(`Server started on ${DOMAIN}`);
});
