import React from 'react';
import PopupWithForm from './PopupWithForm';
import InputForm from './InputForm';

function EditAvatarPopup(props) {

  /*переменная для управления инпутом*/
  const [avatar, setAvatar] = React.useState('');

  /*функция для смены значения переменной из стейта*/
  function handleAvatar(e) {
    setAvatar(e.target.value);
  }

  /*отмена стандартного поведения + отправка введенных данных в инпут на сервер*/
  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatar
    });
  }

  return (
    <PopupWithForm
      name="save_avatar"
      title="Обновить аватар"
      button={props.buttonTitle}
      isOpen={props.isOpen}
      onClose={props.onClose}
      escClose={props.escClose}
      overlayClose={props.overlayClose}
      onSubmit={handleSubmit}
      isButtonActive={props.isButtonActive}
      onButtonActive={props.onButtonActive}>
      <InputForm
        value={avatar}
        onChange={handleAvatar}
        className="popup__job popup__link popup__input"
        id="link-avatar"
        type="url"
        placeholder="Ссылка для картинки"
        name="input_link_profile"
        isOpen={props.isOpen}>
      </InputForm>
    </PopupWithForm>
  );
}


export default EditAvatarPopup;