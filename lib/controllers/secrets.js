const { Router } = require('express');
const Secret = require('../models/Secret');

const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res) => {
    const secret = await Secret.insert({
      title: req.body.title,
      description: req.body.description,
    });
    res.json(secret);
  })

  .get('/', authenticate, async (req, res) => {
    const secret = await Secret.getAll();

    res.json(secret);
  });
