const express = require('express');
const users = require('../controllers/users.js');

const router = express.Router();

router.get('/', users.read_all);
router.get('/:id', users.read_id);
router.post('/', users.create);
router.put('/:id', users.update);
router.delete('/:id', users.delete);
module.exports= router; 