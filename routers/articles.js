const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getArticles, saveArticle, deleteArticle,
} = require('../controllers/articles.js');

router.get('/articles', getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().trim().uri(),
    image: Joi.string().required().trim().uri(),
    owner: Joi.string().alphanum().length(24),
  }),
}), saveArticle);

router.delete('/articles/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), deleteArticle);

module.exports = router;
