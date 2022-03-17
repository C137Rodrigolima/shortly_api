import { Router } from "express";
import { createShortUrl, deleteUrl, getUrls } from "../controllers/urlComanderController";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware";

const urlComanderRouter = Router();

urlComanderRouter.post("/urls/shorten", validateTokenMiddleware, createShortUrl);
urlComanderRouter.get("/urls/:id", getUrls);
urlComanderRouter.delete("/urls/:id", validateTokenMiddleware, deleteUrl);

export default urlComanderRouter;