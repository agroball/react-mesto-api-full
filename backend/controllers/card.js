const cardSchema = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbiddenError');

// получение данных карточки
module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError('Удалять можно только свои карточки');
      }
      cardSchema.findByIdAndDelete(card)
        .then(() => res.status(200).send({ message: 'Успешно' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// лайк
module.exports.likeCard = (req, res, next) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
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
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
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
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
