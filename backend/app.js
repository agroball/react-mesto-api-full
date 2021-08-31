require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { celebrate, Joi } = require('celebrate');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const urlValidation = require('./errors/celebrateError');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(cors({
  origin: 'https://hakuna.matata.nomoredomains.club',
  credentials: true,
}));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);

app.use('*', (req, res, next) => { // eslint-disable-line
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errors());
app.use((err, req, res, next) => {  // eslint-disable-line

  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({

      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
