import { Router } from "express";
import noteRoutes from "./note.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const routes = Router();

routes.use("/notes", noteRoutes);
routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);

export default routes;
