import express from "express";
import cors from "cors";
import config from "./config/config";
import db from "./db/db";
import authRouter from "./routes/authRouter";
import infoRouter from "./routes/infoRouter";
import levelRouter from "./routes/levelRouter";
const app = express();

await db();

app.use(express.json());
app.use(cors());
app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.use("/auth", authRouter);
app.use("/info", infoRouter);
app.use("/level", levelRouter);

app.listen(config.BACKEND_PORT, () => {
  console.log(`Server is running on ${config.BACKEND_PORT}`);
});
