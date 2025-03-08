import { Router } from "express";
import { getLeaderboard } from "../controller/infoController";
import authMiddleware from "../middleware/authMiddleware";

const infoRouter = Router();

infoRouter.get("/leaderboard", (req, res, next) => {
  /**
   * @todo Fix this mess
   */
  authMiddleware(req, res, next); // Hack: Not supposed to be used like this ?? WTF
  getLeaderboard(req, res);
});

export default infoRouter;
