const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/file')

class Book {
    constructor(title = '', description = '', authors = '', favorite = '', fileCover = '', fileName = '', fileBook='', id = uuid()) {
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
        this.id = id
    }
}

const stor = {
    book: [],
    user: [],
};

router.get('/', (req, res) => {
    const {book} = stor
    res.render('book/index', {
        title: 'Books',
        book: book,
    });
})

router.get('/create', (req, res) => {
    res.render('book/create', {
        title: 'create',
        book: {},
    });
})

router.post('/create',  (req, res) => {
    const {book} = stor
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    book.push(newBook)
    res.redirect('/api/books/')
})

router.get('/:id', (req, res) => {
    const {book} = stor
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.render('book/view', {
            title: 'view',
            book: book[idx],
        });
    } else {
        res.redirect('/404');
    }
    

})

router.get('/update/:id', (req, res) => {
    const {book} = stor
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render('book/update', {
        title: 'view',
        book: book[idx],
    });
});

router.post('/update/:id', (req, res) => {
    const {book} = stor
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx !== -1){
        book[idx] = {
            ...book[idx],
            title,
            description, 
            authors,
            favorite, 
            fileCover, 
            fileName,
            fileBook,
        }

        res.redirect(`/api/books/${id}`);
    } else {
        res.redirect('/404');
    }
    
})

router.post('/delete/:id', (req, res) => {
    const {book} = stor
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)
     
    if(idx !== -1){
        book.splice(idx, 1)
        res.redirect(`/api/books/`);
    } else {
        res.redirect('/404');
    }

})

router.get('/:id/download', (req, res) => {
    const {book} = stor
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.download(book[idx].fileBook)
    } else {
        res.status(404)
        res.json('404 | Page not found')
    }

}, (req, res) => {
    express.static(res)

})

module.exports = router