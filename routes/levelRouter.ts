import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getLevel, submitFlag } from "../controller/levelController";

const levelRouter = Router();

levelRouter.get("/getLevel", (req, res, next) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res, next);
  getLevel(req, res);
});

levelRouter.post("/submit", (req, res, next) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res, next);
  submitFlag(req, res);
});

export default levelRouter;
