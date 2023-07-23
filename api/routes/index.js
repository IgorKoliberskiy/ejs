const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/file')

class Book {
  constructor(title = '', description = '', authors = '', favorite = '', fileCover = '', fileName = '', fileBook = '', id = uuid()) {
    this.id = id,
    this.title = title,
    this.description = description,
    this.authors = authors,
    this.favorite = favorite,
    this.fileCover = fileCover,
    this.fileName = fileName,
    this.fileBook = fileBook
  }
}

const stor = {
  books: [],
  user: [],
};

router.get('/', (req, res) => {
  const {url} =  req
  res.json({url})
})

router.post('/api/user/login', (req, res) => {
  res.status(201)
  res.json({id: 1, mail: "test@mail.ru"})
})

router.get('/api/books', (req, res) => {
  const {books} = stor
  res.json(books)
})

router.get('/api/books/:id', (req, res) => {
  const {books} = stor
  const {id} = req.params
  const idx = books.findIndex(el => el.id === id)

  if( idx !== -1) {
    res.json(books[idx])
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
})

router.post('/api/books/', 
  fileMulter.single('cover-books'),
  (req, res) => {   
    const {books} = stor
    const {title, description, authors, favorite, fileCover} = req.body
    
    const fileName = req.file.filename
    const fileBook = req.file.path
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)

    res.status(201)
    res.json(newBook)
  }
)

router.put('/api/books/:id', (req, res) => {
  const {books} = stor
  const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
  const {id} = req.params
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1){
    books[idx] = {
      ...books[idx],
      title,
      description, 
      authors,
      favorite, 
      fileCover, 
      fileBook,
      fileName
    }

    res.json(books[idx])
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
})

router.delete('/api/books/:id', (req, res) => {
  const {books} = stor
  const {id} = req.params
  const idx = books.findIndex(el => el.id === id)
     
  if(idx !== -1){
    books.splice(idx, 1)
    res.json('ok')
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
})

router.get('/api/books/:id/download', (req, res) => {
  const {books} = stor
  const {id} = req.params
  const idx = books.findIndex(el => el.id === id)

  if( idx !== -1) {
    res.download(books[idx].fileBook)
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
}, (req, res) => {
  express.static(res)
})

module.exports = router