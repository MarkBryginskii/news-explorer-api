const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictExplained = require('../errors/ConflictExplained');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictExplained('Такой пользователь уже существует в системе');
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    })
      .then((user) => { res.status(200).send({ user }); }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(() => {
      throw new AuthorizationError('Ошибка авторизации');
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send({ email: user.email, name: user.name }))
    .catch(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

module.exports = {
  createUser, login, getUser,
};
