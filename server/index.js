require('dotenv').config()

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fallback = require('express-history-api-fallback')

const app = express()
const root = path.resolve(__dirname, '../dist')
const port = process.env.SERVER_PORT || 8000

app.use(bodyParser())
app.use(cookieParser())
app.use(express.static(root))
app.use(fallback('index.html', { root }))

app.listen(port, () => console.log('Listening on port ' + port))