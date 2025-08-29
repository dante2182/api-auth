import { Router } from "express";
import {
  getNotes,
  getNoteId,
  createNote,
  updateNote,
  deleteNote,
} from "../controller/note.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const routes = Router();

routes.get("/", requireAuth, getNotes);
routes.get("/:id", requireAuth, getNoteId);

routes.post("/", requireAuth, createNote);
routes.put("/:id", requireAuth, updateNote);
routes.delete("/:id", requireAuth, deleteNote);

export default routes;
