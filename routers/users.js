const router = require('express').Router();
const {
  getUser,
} = require('../controllers/users.js');

router.get('/users/me', getUser);

module.exports = router;
