import { Router } from "express";
import { ExpressAuth } from "@auth/express";
import { authConfig } from "../libs/auth.js";

const routes = Router();

routes.use("/", ExpressAuth(authConfig));

export default routes;
