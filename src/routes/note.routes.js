import { Router } from "express";
import {
  getNotes,
  getNoteId,
  createNote,
  updateNote,
  deleteNote,
} from "../controller/note.controller.js";

const routes = Router();

routes.get("/", getNotes);
routes.post("/", createNote);
routes.put("/:id", updateNote);
routes.delete("/:id", deleteNote);
routes.get("/:id", getNoteId);

export default routes;
