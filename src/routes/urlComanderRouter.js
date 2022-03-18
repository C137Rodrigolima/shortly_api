import { Router } from "express";
import { createShortUrl, deleteUrl, getUrls } from "../controllers/urlComanderController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const urlComanderRouter = Router();

urlComanderRouter.post("/urls/shorten", validateTokenMiddleware, createShortUrl);
urlComanderRouter.get("/urls/:id", getUrls);
urlComanderRouter.delete("/urls/:id", validateTokenMiddleware, deleteUrl);

export default urlComanderRouter;