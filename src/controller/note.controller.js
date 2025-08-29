import { prisma } from "../config/db.js";

export const getNotes = async (req, res) => {
  try {
    // Filtrar notas por usuario si está autenticado
    const notes = await prisma.note.findMany({
      where: req.user ? { userId: req.user.id } : { id: String(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
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
      where: { id: String(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Opcional: Verificar si la nota pertenece al usuario actual
    if (req.user && note.userId && note.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para ver esta nota" });
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
        userId: req.user?.id, // Asociar la nota con el usuario autenticado
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

    // Verificar si la nota existe y pertenece al usuario
    const existingNote = await prisma.note.findUnique({
      where: { id: String(id) },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Verificar si el usuario tiene permiso para actualizar esta nota
    if (
      req.user &&
      existingNote.userId &&
      existingNote.userId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para actualizar esta nota" });
    }

    const updateNote = await prisma.note.update({
      where: { id: String(id) },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(updateNote);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la nota existe y pertenece al usuario
    const existingNote = await prisma.note.findUnique({
      where: { id: String(id) },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Verificar si el usuario tiene permiso para eliminar esta nota
    if (
      req.user &&
      existingNote.userId &&
      existingNote.userId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar esta nota" });
    }

    await prisma.note.delete({
      where: { id: String(id) },
    });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};
