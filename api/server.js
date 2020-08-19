const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({
    message: "Something went wrong",
  })
})

server.get('/', async (req, res, next) => {
  try {
    const accounts = await db.select('*').from('accounts')
    res.status(200).json(accounts)
  }
  catch (err) {
    next(err)
  }
});

server.get('/:id', async (req, res, next) => {
  try {
    const [account] = await db.select('*')
      .from('accounts')
      .where('id', req.params.id)
      .limit(1)
    res.status(200).json(account)
  }
  catch (err) {
    next(err)
  }
})

server.post('/', async (req, res, next) => {
  try {
    const [id] = await db.insert({
      name: req.body.name,
      budget: req.body.budget,
    })
      .into('accounts')

    const account = await db('accounts')
      .where('id', id)
      .first()
    res.status(201).json(account)
  }
  catch (err) {
    next(err)
  }
})

server.put('/:id', async (req, res, next) => {
  try {
    await db('accounts')
      .update({
        name: req.body.name,
        budget: req.body.budget,
      })
      .where('id', req.params.id)

    const account = await db('accounts')
      .where('id', req.params.id)
      .first()

    res.status(200).json(account)
  }
  catch (err) {
    next(err)
  }
})

server.delete('/:id', async (req, res, next) => {
  try {
    await db('accounts')
      .where('id', req.params.id)
      .del()
    res.status(204).end()
  }
  catch (err) {
    next(err)
  }
})

module.exports = server;
