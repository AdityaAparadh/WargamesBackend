import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  getLevel,
  getQuizLevel,
  submitFlag,
  submitQuiz,
} from "../controller/levelController";

const levelRouter = Router();

levelRouter.get("/getLevel", (req, res) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res);
  getLevel(req, res);
});

levelRouter.post("/submitFlag", (req, res) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res);
  submitFlag(req, res);
});

levelRouter.get("/getQuizLevel", (req, res) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res);
  getQuizLevel(req, res);
});

levelRouter.post("/submitQuizAnswer", (req, res) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res);
  submitQuiz(req, res);
});

export default levelRouter;
