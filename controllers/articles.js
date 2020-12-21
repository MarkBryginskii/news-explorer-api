const Article = require('../models/article.js');

const RequestError = require('../errors/RequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const saveArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => { res.status(200).send(article); })
    .catch(() => {
      throw new RequestError('Ошибка создание карточки статьи');
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const article = Article.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    .orFail()
    .then((data) => res.status(200).send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Переданны не корректные данные');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Нет статьи с таким id');
      } else if (article.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Невозможно удалить карточку другого пользователя');
      }
    })
    .catch(next);
};

module.exports = {
  getArticles, saveArticle, deleteArticle,
};
