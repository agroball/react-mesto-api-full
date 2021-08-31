const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const InvalidRequestError = require('../errors/invalidRequestError');

// создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// получение данных карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError('Удалять можно только свои карточки');
      }
      Card.findByIdAndDelete(card)
        .then(() => res.status(200).send({ message: 'Успешно' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new InvalidRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// постановка лайка
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .populate('likes')
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new InvalidRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

// удаление лайка
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .populate('likes')
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new InvalidRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
