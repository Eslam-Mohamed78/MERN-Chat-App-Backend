import express from "express";
import dotenv from "dotenv";
import "colors";
import appRouter from "./src/app.router.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// allow access from all origins (urls)
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}!`.yellow.bold);
});

appRouter(app, express, server);
