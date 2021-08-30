import React from 'react';
import PopupWithForm from './PopupWithForm';
import InputForm from './InputForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {

  const currentUser = React.useContext(CurrentUserContext);

  /*переменные для управления инпутами*/
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  /*функции для смены значений переменых из стейта*/
  function handleName(e) {
    setName(e.target.value);
  }

  function handleDescription(e) {
    setDescription(e.target.value);
  }

  /*отмена стандартного поведения + отправка введенных данных в инпуты на сервер*/
  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name: name.trim(),
      about: description.trim(),
    });
  }

  /*установка данных профиля*/
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);
  
  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      button={props.buttonTitle}
      isOpen={props.isOpen}
      onClose={props.onClose}
      escClose={props.escClose}
      overlayClose={props.overlayClose}
      onSubmit={handleSubmit}
      isButtonActive={props.isButtonActive}
      onButtonActive={props.onButtonActive}>
      <InputForm
        value={name}
        onChange={handleName}
        className="popup__name popup__input popup_profile_name"
        id="name-card-profile"
        type="text"
        minLength="2"
        maxLength="40"
        placeholder="Имя"
        name="input_name_profile"
        isOpen={props.isOpen}>
      </InputForm>
      <InputForm
        value={description}
        onChange={handleDescription}
        className="popup__job popup__input popup_profile_job"
        id="job-card"
        type="text"
        minLength="2"
        maxLength="200"
        placeholder="Профессия"
        name="input_job_profile"
        isOpen={props.isOpen}>
      </InputForm>
    </PopupWithForm>
  );
}

export default EditProfilePopup;