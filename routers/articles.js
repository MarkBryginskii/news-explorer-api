const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getArticles, saveArticle, deleteArticle,
} = require('../controllers/articles.js');

router.get('/articles', auth, getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9-_]{1,}\.[-a-zA-Z0-9@:%._/+~#=()]{1,}/i),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9-_]{1,}\.[-a-zA-Z0-9@:%._/+~#=()]{1,}/i),
    owner: Joi.string().alphanum().length(24),
  }),
}), auth, saveArticle);

router.delete('/articles/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), auth, deleteArticle);

module.exports = router;
