import React from 'react';

function DeletePopup(props) {

/*отмена стандартного поведения + удаление карточки + закрытия попапа*/
  function handleSubmit(e) {
    e.preventDefault();
    props.onCardDelete(props.card);
    props.onClose();
  }

  /*добавляет слушатель для закрытия по Esc только при открытии попапа*/ 
  React.useEffect(() => {
    props.escClose(props.isOpen);
  }, [props.isOpen, props.escClose])

  return (
    <div className={`popup popup_delete_card ${props.isOpen && 'popup_opened'}`} onClick={props.overlayClose}>
      <form className="popup__container popup__container_form popup__delete-form" name="popup_delete" noValidate>
        <button className="popup__close popup__close_delete" type="button" onClick={props.onClose}></button>
        <h2 className="popup__title popup__title-delete">Вы уверены?</h2>
        <button className={`popup__submit popup__submit_delete ${props.buttonTitle.isLoad && 'popup__submit_loading'}`} type="button" onClick={handleSubmit}>{props.buttonTitle.buttonTitle}</button>
      </form>
    </div>
  );
}

export default DeletePopup;


