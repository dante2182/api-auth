export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: error.errors
    })
  }
}
