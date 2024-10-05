import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

import projectRoute from "./routes/projectRoute";
import taskRoute from "./routes/taskRoute";
import searchRoute from "./routes/searchRoute";
import userRoute from "./routes/userRoute";
import teamRoute from "./routes/teamRoute";
import authRoute from "./routes/authRoute";
import passport from "passport";
import expressSession from "express-session";
import "./strategies/google-strategy";
import path from "path";

const app = express();

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  expressSession({
    secret: process.env.COOKIE_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60000 * 24 * 7, httpOnly: true, secure: false },
  })
);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/projects", projectRoute);
app.use("/tasks", taskRoute);
app.use("/search", searchRoute);
app.use("/users", userRoute);
app.use("/teams", teamRoute);
app.use("/auth", authRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
