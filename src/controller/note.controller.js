import { prisma } from "../config/db.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const getNoteId = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updateNote = await prisma.note.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(updateNote);
    if (!updateNote) {
      return res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNote = await prisma.note.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json(`Note deleted successfully`);
    if (!deleteNote) {
      return res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};
