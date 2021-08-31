const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateProfile, updateAvatar, getUserMe, signOut,
} = require('../controllers/users');
const urlValidation = require('../errors/celebrateError');

router.get('/me', getUserMe);
router.get('/me/signout', signOut);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);
router.get('/', getUsers);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidation).required(),
  }),
}), updateAvatar);

module.exports = router;
