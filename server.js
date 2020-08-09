const path = require('path')
const express = require('express')
const fallback = require('express-history-api-fallback')
const compression = require('compression')
const root = path.resolve(__dirname, './dist')
const port = process.env.PORT || 8001
const app = express()

app.use(compression())
app.use(express.static(root))
app.use(fallback('index.html', { root }))

app.listen(port, () => console.log('Listening on port ' + port))