const router = require('express').Router();
const usersRouters = require('./users');
const articlesRouters = require('./articles');

const NotFoundError = require('../errors/NotFoundError');

router.use('/', usersRouters);
router.use('/', articlesRouters);

router.all('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
