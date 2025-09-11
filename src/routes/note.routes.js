import { Router } from 'express'
import {
  getNotes,
  getNoteId,
  createNote,
  updateNote,
  deleteNote
} from '../controller/note.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { noteSchema } from '../schema/note.schema.js'

const routes = Router()

routes.get('/', requireAuth, getNotes)
routes.get('/:id', requireAuth, getNoteId)

routes.post('/', requireAuth, validate(noteSchema), createNote)
routes.put('/:id', requireAuth, validate(noteSchema), updateNote)
routes.delete('/:id', requireAuth, deleteNote)

export default routes
