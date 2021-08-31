import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeletePopup from "./DeletePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import successImage from "../images/success.svg";
import failImage from "../images/fail.svg";
import * as auth from "../utils/auth.js";

function App(props) {
  /*стейты для открытия попапов*/
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [isPopupWithImageOpen, setIsPopupWithImageOpen] = React.useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = React.useState(false);
  const [isFailPopupOpen, setIsFailPopupOpen] = React.useState(false);
  /*стейты для данных профиля и карточек*/
  const [selectedCard, setSelectedCard] = React.useState({ link: "" });
  const [currentUser, setCurrentUser] = React.useState({ name: "", about: "", avatar: "" });
  const [cards, setCards] = React.useState([]);
  /*стейт для отображения загрузки данных*/
  const [loading, setLoading] = React.useState(false);
  /*стейты для контроля названия кнопок при отправке данных*/
  const [buttonSave, setButtonSave] = React.useState({ isLoad: false, buttonTitle: "Сохранить" });
  const [buttonAdd, setButtonAdd] = React.useState({ isLoad: false, buttonTitle: "Создать" });
  const [buttonDelete, setButtonDelete] = React.useState({ isLoad: false, buttonTitle: "Да" });
  /*стейт для проверки авторизован ли пользователь*/
  const [loggedIn, setLoggedIn] = React.useState(false);
  /*стейты для контроля состояния кнопок при валидации*/
  const [isButtonEdditProfile, setIsButtonEdditProfile] = React.useState(false);
  const [isButtonAddPlace, setIsButtonAddPlace] = React.useState(false);
  const [isButtonAvatar, setIsButtonAvatar] = React.useState(false);

  /*стейты для контроля элемента link в компоненте Header*/
  const [isAuth, setIsAuth] = React.useState(true);
  const [exit, setExit] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [hamburger, setHamburger] = React.useState(false);

  /*функции открытия попапов*/
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleSuccessPopupClick() {
    setIsSuccessPopupOpen(true);
  }

  function handleFailPopupClick() {
    setIsFailPopupOpen(true);
  }

  function handleDeleteClick() {
    setIsDeletePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsPopupWithImageOpen(true);
  }

  /*функция закрытия попапов + удаления слушателя для закрытия на escape*/
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsPopupWithImageOpen(false);
    setIsFailPopupOpen(false);
    setIsSuccessPopupOpen(false);
    document.removeEventListener("keydown", escClose);
  }
  /*обработка нажатия на escape*/
  function escClose(evt) {
    if (evt.key === "Escape") {
      closeAllPopups();
    }
  }
  /*функция закрытия на escape*/
  function handleEscClose(isOpen) {
    if (isOpen) {
      document.addEventListener("keydown", escClose);
    }
  }

  /*функция закрытия на overlay*/
  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("popup_opened")) {
      closeAllPopups();
    }
  }

  /*функция, которая контролирует название кнопки сабмита формы*/
  function handleButton(isLoad, buttonTitle, setState) {
    setState({ isLoad: isLoad, buttonTitle: buttonTitle });
  }

  /*получение данных о пользователе и карточек + использование их на странице*/
  React.useEffect(() => {
    if(loggedIn){
    setLoading(true);
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, cardList]) => {
        setCurrentUser(userInfo);
        setCards(cardList);
        setLoading(false);
        console.log(cardList, userInfo);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [loggedIn]);

  /*функция постановки лайка*/
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /*функции удаления карточки*/
  function handleDeleteCard(card) {
    setSelectedCard(card);
  }

  function handleCardDelete(card) {
    handleButton(true, "Удаление...", setButtonDelete);
    api.deleteCard(card._id)
      .then(() => {
        handleButton(false, "Да", setButtonDelete);
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /*обновление данных о пользователе*/
  function handleUpdateUser({ name, about }) {
    handleButton(true, "Сохранение...", setButtonSave);
    api.setUserInfo(name, about)
      .then((data) => {
        setCurrentUser(data);
        handleButton(false, "Сохранить", setButtonSave);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    handleButton(true, "Сохранение...", setButtonSave);
    api.updateAvatarImage(avatar)
      .then((data) => {
        setCurrentUser(data);
        handleButton(false, "Сохранить", setButtonSave);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /*добавление новой карточки*/
  function handleAddPlace({ name, link }) {
    handleButton(true, "Создание...", setButtonAdd);
    api.addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleButton(false, "Создать", setButtonAdd);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /*проверка токена для авторизованного пользователя*/
  function handleTokenCheck() {
    console.log(localStorage.getItem('auth'))
    if (localStorage.getItem('auth')) {
      auth.checkToken()
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          props.history.push("/");
          setEmail(res.email);
          
        }
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  /*контроль названия элемента link в компоненте Header*/
  function handleLink() {
    setIsAuth(!isAuth);
  }
  /*авторизация пользователя*/
  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then((res) => {
        setEmail(email);
        setLoggedIn(true);
        setExit(true);
        props.history.push('/');
        localStorage.setItem('auth', true);
      })
      .catch((err) => {
        handleFailPopupClick();
        console.log(err)
      }
      );
  }
  /*регистрация пользователя*/
  function handleRegister(email, password) {
    auth.register(email, password)
      .then((res) => {
        handleSuccessPopupClick();
        props.history.push('/sign-in');
      })
      .catch((err) => {
        handleFailPopupClick();
        console.log(err)
      }
      );
  }
  /*обработка выхода пользователя из профиля*/
  function handleSignOut() {
    props.history.push('/sign-in');
    auth.signOut()
    .then((res) => {
      setExit(false);
      setEmail('');
      setLoggedIn(false);
      setHamburger(false);
      localStorage.removeItem('auth');
    })
    .catch((err) => {
      console.log(err)
    }
    );
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        isHamburger={hamburger}
        onHamburger={setHamburger}
        isExit={exit}
        onExit={setExit}
        email={email}
        handleLink={handleLink}
        isAuth={isAuth}
        loggedIn={loggedIn}
        onSignOut={handleSignOut} />
      <Switch>
        <ProtectedRoute
          exact="exact"
          path="/"
          component={Main}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onDeleteClick={handleDeleteClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteCard}
          isLoading={loading}
          loggedIn={loggedIn} />
        <Route exact path="/sign-in">
          <Login
            onLogin={handleLogin} />
        </Route>
        <Route exact path="/sign-up">
          <Register
            onRegister={handleRegister}
            isAuth={isAuth}
            handleLink={handleLink} />
        </Route>
        <Route>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
      {loggedIn && <Footer />}
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose}
        onUpdateUser={handleUpdateUser}
        buttonTitle={buttonSave}
        isButtonActive={isButtonEdditProfile}
        onButtonActive={setIsButtonEdditProfile} />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose}
        onAddPlace={handleAddPlace}
        buttonTitle={buttonAdd}
        isButtonActive={isButtonAddPlace}
        onButtonActive={setIsButtonAddPlace} />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose}
        onUpdateAvatar={handleUpdateAvatar}
        buttonTitle={buttonSave}
        isButtonActive={isButtonAvatar}
        onButtonActive={setIsButtonAvatar} />
      <DeletePopup
        card={selectedCard}
        isOpen={isDeletePopupOpen}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose}
        onCardDelete={handleCardDelete}
        buttonTitle={buttonDelete} />
      <ImagePopup
        isOpen={isPopupWithImageOpen}
        card={selectedCard}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose} />
      <InfoTooltip
        isOpen={isSuccessPopupOpen}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose}
        src={successImage}
        title="Вы успешно зарегистрировались!" />
      <InfoTooltip
        isOpen={isFailPopupOpen}
        onClose={closeAllPopups}
        escClose={handleEscClose}
        overlayClose={handleOverlayClose}
        src={failImage}
        title="Что-то пошло не так!Попробуйте ещё раз." />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);