import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Login from './Login.js';
import Register from './Register';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import {api} from '../utils/api';
import * as Auth from '../utils/auth';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoToolTip";
import React from "react";
import RegOk from '../images/registration-ok.svg';
import RegNoOK from '../images/login-fail.svg';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Footer from "./Footer";


function App() {

    /*стейты для открытия попапов*/
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isPopupWithImageOpen, setIsPopupWithImageOpen] = React.useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);

    /*стейты для данных профиля и карточек*/
    const [selectedCard, setSelectedCard] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState({ name: '', about: ''});

    /*стейт для проверки авторизован ли пользователь*/
    const [loggedIn, setLoggedIn] = React.useState(false);

    /*стейты для контроля элемента link в компоненте Header*/
    const [email, setEmail] = React.useState('');


    const [message, setMessage] = React.useState({ iconPath: '', text: '' });
    const history = useHistory();

    /*проверка токена для авторизованного пользователя*/
    function handleTokenCheck() {
        console.log(localStorage.getItem('Auth'))
        if (localStorage.getItem('Auth')) {
            Auth.checkToken()
                .then((res) => {
                    if (res) {
                        setLoggedIn(true);
                        history.push("/");
                        setEmail(res.data.email);
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }

    React.useEffect(() => {
        handleTokenCheck();
    }, [history]);



    /*получение данных о пользователе и карточек + использование их на странице*/
    React.useEffect(() => {
        const promises = [api.getUserInfo(), api.getInitialCards()];
        Promise.all(promises)
            .then(([user, cards]) => {
                console.log(user, cards)
                setCurrentUser(user);
                setCards(cards);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);



    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick(){
        setIsAddPlacePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleInfoTooltipPopupOpen() {
        setIsInfoTooltipPopupOpen(true);
    }

    function handleInfoTooltipContent({iconPath, text}) {
        setMessage({ iconPath: iconPath, text: text })
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setIsPopupWithImageOpen(true);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard({});
        setIsPopupWithImageOpen(false);
        setIsInfoTooltipPopupOpen(false);
    }

    function handleLikeClick(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
                const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
                // Обновляем стейт
                setCards(newCards);
            })
            .catch((err) => console.log(err));
    }

    function handleDeleteClick(card){
        api.deleteCard(card._id)
            .then((newCard)=> {
                const newCards = cards.filter((c) =>
                    c._id === card._id ? "" : newCard
                );
                setCards(newCards);
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateUser({name, about}) {
        return api.setUserInfo(name, about)
            .then((result) => {
                setCurrentUser(result);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(data) {
        api.updateAvatarImage(data)
            .then((result) => {
                setCurrentUser(result);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit({name, link}) {
        api.addCard(name, link)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    /*регистрация пользователя*/
    function handleRegister(email, password) {
        Auth.register(email, password)
            .then((res) => {
                handleInfoTooltipContent({iconPath: RegOk, text: 'Вы успешно зарегистрировались!'})
                handleInfoTooltipPopupOpen();
                // Перенаправляем на страницу логина спустя 3сек и закрываем попап
                setTimeout(history.push, 3000, "/sign-in");
                setTimeout(closeAllPopups, 2500);
                history.push('/sign-in');
            })
            .catch((err) => {
                handleInfoTooltipContent({iconPath: RegNoOK, text: 'Что-то пошло не так! Попробуйте ещё раз.'})
                handleInfoTooltipPopupOpen();
                setTimeout(closeAllPopups, 2500);
                    console.log(err)
                }
            );
    }

    /*авторизация пользователя*/
    function handleLogin(email, password) {
        Auth.authorize(email, password)
            .then((res) => {
                setEmail(email);
                setLoggedIn(true);
                history.push('/');
                localStorage.setItem('Auth', true);
                handleInfoTooltipContent({iconPath: RegOk, text: 'Вы успешно авторизовались!'})
                handleInfoTooltipPopupOpen();
                // Перенаправляем на главную страницу спустя 3сек и закрываем попап
                setTimeout(history.push, 3000, "/");
                setTimeout(closeAllPopups, 2500);
            })
            .catch((err) => {
                    handleInfoTooltipContent({iconPath: RegNoOK, text: 'Что то пошло не так! Попробуйте еще раз!'})
                    handleInfoTooltipPopupOpen();
                    console.log(err)
                }
            );
    }


    /*обработка выхода пользователя из профиля*/
    function handleSignOut() {
        history.push('/sign-in');
        Auth.signOut()
            .then((res) => {
                setEmail('');
                setLoggedIn(false);
                localStorage.removeItem('Auth');
            })
            .catch((err) => {
                    console.log(err)
                }
            );
    }

    return (
<>
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} email={email} handleSignOut={handleSignOut}/>
        <Switch>
            {currentUser && <ProtectedRoute
                exact path="/"
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleLikeClick}
                onCardDelete={handleDeleteClick}
            />}
            <Route path="/sign-in">
                <Login
                    onLogin={handleLogin}
                />
            </Route>
            <Route path="/sign-up">
                <Register
                    onRegister={handleRegister}
                />
            </Route>
            <Route path="/">
                {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
        </Switch>
        {loggedIn && <Footer />}
        <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
        />

          <PopupWithForm name="agreePopup"
                         title="Вы уверены?"
                         button="Да">
          </PopupWithForm>


          <ImagePopup
              card={selectedCard}
              isOpen={isPopupWithImageOpen}
              onClose={closeAllPopups}
          >
          </ImagePopup>
        {currentUser &&
        <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            message={message}
        />
        }
    </CurrentUserContext.Provider>
</>
  );
}

export default App;




















































