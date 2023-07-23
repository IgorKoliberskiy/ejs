const express = require('express')

const logger = require('./middleware/logger')
const err404 = require('./middleware/err-404')
const indexRouter = require('./routes/index')

const app = express()
app.use(express.json())

app.use(logger)

app.use('/public', express.static(__dirname+'public'))
app.use('/', indexRouter)

app.use('/api/user/login', indexRouter)
app.use('/api/books', indexRouter)
app.use('/api/books/:id', indexRouter)
app.use('/api/books/', indexRouter)
app.use('/api/books/:id', indexRouter)
app.use('/api/books/:id/download', indexRouter)

app.use(err404)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server started!')
});