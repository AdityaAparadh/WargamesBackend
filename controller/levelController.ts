import type { Request, Response } from "express";
import User from "../models/user";
import Level, { type ILevel } from "../models/level";

/**
 * Controller to return scripts to setup, run and cleanup level
 */
const getLevel = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const level = currentUser.currentLevel;
    const findLevel = (await Level.findOne({ level })) as ILevel;

    if (!findLevel) {
      return res.status(404).send({ message: "Level not found" });
    }
    return res.status(200).send({
      preload: findLevel.preload,
      run: findLevel.run,
      cleanup: findLevel.cleanup,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

/**
 * Flag submission controller
 */
const submitFlag = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!req.body.flag) {
      return res.status(400).send({ message: "Flag not provided" });
    }

    const currentLevel = currentUser.currentLevel;
    if (currentUser.currentLevel != currentLevel) {
      return res.status(401).send({
        message:
          "You either already have completed this level, or not allowed to access this level yet.",
      });
    }

    const findLevel = await Level.findOne({ level: currentLevel });
    if (!findLevel) {
      return res.status(404).send({ message: "Level not found" });
    }

    if (findLevel.flag == req.body.flag) {
      currentUser.currentLevel = currentLevel + 1;
      await currentUser.save();
      return res.status(200).send({
        message: "Correct Flag. Yay!",
      });
    } else {
      return res.status(401).send({ message: "Incorrect Flag" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { getLevel, submitFlag };
