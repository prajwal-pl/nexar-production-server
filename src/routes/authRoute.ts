import { Router } from "express";
import passport from "passport";

const router = Router();

const CLIENT_URL = "http://localhost:3000";

router.get(
  "/google",
  (req, res, next) => {
    console.log("Initiating Google authentication");
    next();
  },
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/callback/google",
  (req, res, next) => {
    console.log("Google callback URL hit");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: CLIENT_URL,
  }),
  (req, res) => {
    console.log("User authenticated successfully");
    res.send("Authentication successful");
  }
);

router.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.redirect(`CLIENT_URL`); // Redirect to the home page or login page
    });
  });
});

export default router;
