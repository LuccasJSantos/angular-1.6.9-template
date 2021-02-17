const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('build'))

app.get('/')

app.listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`)) 