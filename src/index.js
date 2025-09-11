import app from './app.js'
import { PORT } from './config/env.js'

app.listen(PORT, () => {
  console.log('server is running 🚀')
  console.log(`http://localhost:${PORT}`)
})
