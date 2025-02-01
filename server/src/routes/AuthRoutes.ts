import express from "express";
import passport from "passport";
export const authRouter = express.Router();

authRouter.get('/', passport.authenticate("google", {
    scope: ["profile", "email"],
  }));