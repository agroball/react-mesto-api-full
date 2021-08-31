const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const InvalidRequestError = require('../errors/invalidRequestError');
const MongoError = require('../errors/mongoError');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', 'Bearer ' + token, { // eslint-disable-line
        maxAge: 3600000,
        secure: true,
        httpOnly: true,
        sameSite: 'None',
      })
        .end();
    })
    .catch((err) => {
      if (err.name === 'Error') next(new UnauthorizedError('Неправильные почта или пароль'));
      next(err);
    });
};

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else if (err.name === 'MongoError') {
        next(new MongoError('Эта почта уже используется'));
      }
      next(err);
    });
};
// получение данных пользователя
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// получение данных пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// обновление данных профиля
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// обновление данных аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.signOut = (req, res) => {
  res.clearCookie('jwt').end();
};
