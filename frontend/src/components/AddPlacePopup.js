import React from 'react';
import InputForm from './InputForm';
import PopupWithForm from './PopupWithForm';


function AddPlacePopup(props) {

  /*переменные для управления инпутами*/
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  /*функции для смены значений переменых из стейта*/
  function handleName(e) {
    setName(e.target.value);
  }

  function handleLink(e) {
    setLink(e.target.value);
  }

  /*отмена стандартного поведения + отправка введенных данных в инпуты на сервер*/
  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name: name.trim(),
      link: link,
    });
  }

  /*очистка инпутов*/
  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen])


  return (
    <PopupWithForm
      name="gallery"
      title="Новая карточка"
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
        className="popup__name popup__name_gallery popup__input"
        id="name-card"
        type="text"
        minLength="2"
        maxLength="30"
        placeholder="Название карточки"
        name="input_name_gallery"
        isOpen={props.isOpen}>
      </InputForm>
      <InputForm
        value={link}
        onChange={handleLink}
        className="popup__job popup__link popup__input"
        id="link-card"
        type="url"
        placeholder="Ссылка для картинки"
        name="input_link_gallery"
        isOpen={props.isOpen}
        xName={link}>
      </InputForm>
    </PopupWithForm>
  );
}

export default AddPlacePopup;