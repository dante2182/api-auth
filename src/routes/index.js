import { Router } from "express";
import noteRoutes from "./note.routes.js";

const routes = Router();

routes.use("/notes", noteRoutes);

export default routes;
