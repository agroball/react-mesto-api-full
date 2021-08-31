import React from "react";

function PopupWithForm(props) {

  const formRef = React.useRef();
  const children = props.children;
  const [buttonState, setButtonState] = React.useState(true);

 /*добавляет слушатель для закрытия по Esc только при открытии попапа*/ 
  React.useEffect(() => {
    props.escClose(props.isOpen);
  }, [props.isOpen, props.escClose])

  /*проверка полей формы на корректность для смены состояния кнопки(активна или нет)*/
  React.useEffect(() => {
    /*если реф привязан к форме, и все поля формы валидны, и инпуты содержат символы помимо пробелов*/
    if (formRef.current && formRef.current.checkValidity() && Array.from(children).every((input) => input.props.value.trim() !== '')) {
      setButtonState(false);
      props.onButtonActive(false);
    } else {
      setButtonState(true);
      props.onButtonActive(true);
    }
  })

  return (
    <div className={`popup popup_${props.name} ${props.isOpen && 'popup_opened'}`} onClick={props.overlayClose}>
      <form ref={formRef} className={`popup__container popup__container_form popup__${props.name}-form`} name={`popup_${props.name}`} onSubmit={props.onSubmit} noValidate>
        <button className="popup__close" type="button" onClick={props.onClose} ></button>
        <h2 className={`popup__title popup__title-${props.name}`}>{props.title}</h2>
        {children}
        <button className={`popup__submit ${props.button.isLoad && 'popup__submit_loading'} ${props.isButtonActive && 'popup__button_invalid'}`} type="submit" disabled={buttonState}>
          {props.button.buttonTitle}
        </button>
      </form>
    </div>
  );
}

export default PopupWithForm;