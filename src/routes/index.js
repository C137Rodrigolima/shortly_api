import { Router } from "express";
import authRouter from "./authRouter.js";
import urlComanderRouter from "./urlComanderRouter.js";
import userRouter from "./userRouter.js";

const router = Router();
router.use(authRouter);
router.use(userRouter);
router.use(urlComanderRouter);

export default router;