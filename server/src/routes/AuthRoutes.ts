import express from "express";
import passport from "passport";
import { FRONTEND_URL } from "../config/constants";

export const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/home`,
    failureRedirect: `${FRONTEND_URL}/login2`,
  }),
  (req, res) => {
    res.redirect(301, `${FRONTEND_URL}/home`);
  }
);

authRouter.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({
      message: "Please login first.",
    });
  }
  res.json(req.user);
});

authRouter.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid"); 
      res.status(200).json({ message: "Logout successful" });
    });
  } else {
    res.status(200).json({ message: "No active session to log out" });
  }
});
