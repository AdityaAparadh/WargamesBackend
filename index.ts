import express from "express";
import cors from "cors";
import config from "./config/config";
import db from "./db/db";
const app = express();

await db();

app.use(cors());
app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.listen(config.BACKEND_PORT, () => {
  console.log(`Server is running on ${config.BACKEND_PORT}`);
});
