import type { Request, Response } from "express";
import User from "../models/user";
import config from "../config/config";
import jwt from "jsonwebtoken";
import type { IJWTPayload } from "../middleware/authMiddleware";

/**
 * Allows user to signup with username and password
 */
const SignUp = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send({ message: "Both Username and Password are required" });
    }
    const findUser = await User.findOne({ username });

    if (findUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    /**
     * @todo Implement bcrypt for password hashing
     * Right now it is kept plaintext for testing
     */

    const newUser = new User({
      username,
      password,
      currentLevel: 1,
      currentQuizLevel: 1,
      correctQuizLevels: [],
      lastSubmission: new Date(),
    });

    await newUser.save();

    return res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

/**
 * Login and get a jwt token
 */
const Login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send({ message: "Both Username and Password are required" });
    }

    /**
     * @todo convert to bcrypt
     */

    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(404).send({ message: "User not found" });
    }
    if (findUser.password !== password) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }
    const tokenData: IJWTPayload = { username };
    const token = jwt.sign(tokenData, config.JWT_SECRET, {});
    return res.status(200).send({ message: "Login Successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { SignUp, Login };
