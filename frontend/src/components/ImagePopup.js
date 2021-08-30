import React from "react";

function ImagePopup(props) {

  /*добавляет слушатель для закрытия по Esc только при открытии попапа*/ 
  React.useEffect(() => {
    props.escClose(props.isOpen);
  }, [props.isOpen, props.escClose])

  return (
    <div className={`popup popup_fullsize_wrapper ${props.isOpen && 'popup_opened'}`} onClick={props.overlayClose}>
      <form className="popup__container popup__fullsize" name="popup_fullsize"  >
        <button className="popup__close" type="button" onClick={props.onClose}></button>
        <img className="popup__image-fullsize" src={props.card.link} alt={props.card.name} />
        <h2 className="popup__title popup__title-fullsize">{props.card.name}</h2>
      </form>
    </div>
  );
}

export default ImagePopup;