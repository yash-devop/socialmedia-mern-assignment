import { connectMongoDB } from "./config/db";
import express, { Request, Response } from "express";
import passport from "passport";
import "./config/passport";
import { authRouter } from "./routes/AuthRoutes";

connectMongoDB();

const app = express();
app.use(express.json());
const apiRouter = express.Router();
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", apiRouter);

apiRouter.get("/auth/google", authRouter);
apiRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

apiRouter.get('/profile', (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({
        message: "Please login first."
    })
  }
  res.json(req.user); // Return user profile if authenticated
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server started on", PORT);
});