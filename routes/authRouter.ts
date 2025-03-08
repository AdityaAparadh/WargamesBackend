import express from "express";
import { Login, SignUp } from "../controller/authController";

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  Login(req, res);
});

authRouter.post("/signup", (req, res) => {
  SignUp(req, res);
});

export default authRouter;
