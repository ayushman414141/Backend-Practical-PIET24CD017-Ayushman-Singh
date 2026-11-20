const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();

// Reject malformed ids with 400 before hitting the database
router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }
  next();
});

// POST /books -> add a book (201)
router.post('/', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err); // ValidationError -> 400 in errorHandler
  }
});

// GET /books -> list all books (200)
router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Book.find());
  } catch (err) {
    next(err);
  }
});

// GET /books/:id -> one book (200 / 404)
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
});

// PUT /books/:id -> update a book (200 / 400 / 404)
router.put('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
});

// DELETE /books/:id -> delete a book (200 / 404)
router.delete('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
