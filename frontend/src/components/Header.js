import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Hamburger } from './Hamburger';

function Header(props) {

  /*стейт для смены состояния названия элемента link*/
  const [linkState, setLinkState] = React.useState('');

  /*проверка переменной для подстановки названия элемента Link*/
  function changeOfState() {
    if (props.isExit) {
      setLinkState('Выйти');
    } else {
      setLinkState(props.isAuth ? 'Регистрация' : 'Войти')
    }
  }
 
  /*функция меняет состояние элемента link*/
  function handleState() {
    if (props.isExit) {
      /*выход из профиля*/
      props.onSignOut();
    } else {
      /*установка первоначального значения в элемент link*/
      props.handleLink();
    }
  }

  /*обработка для отображения или скрытия компонента Hamburger*/
  function handleHamburger() {
    props.onHamburger(!props.isHamburger);
  }

  /*функция вызывается при изменении пропсов*/
  React.useEffect(() => {
    changeOfState();
  }, [props.isExit, props.isAuth])

  /*обработка состояния элемента link после перезагрузки страницы*/
  React.useEffect(() => {
    if (props.loggedIn) props.onExit(true)
  }, [props.loggedIn])

  return (
    <header className="header">
      <Hamburger
        linkState={linkState}
        email={props.email}
        onSetHamburger={handleHamburger}
        isHamburger={props.isHamburger}
        isExit={props.exit}
        isAuth={props.isAuth}
        onHandleState={handleState}
        loggedIn={props.loggedIn} />
      <div className={`header__desktop ${!props.loggedIn && 'header__desktop_visible'}`}>
        <div className="header__logo"></div>
        <div className="header__wrapper">
          <p className="header__email">{props.email}</p>
          <Link
            to={(props.isAuth && !props.isExit) ? (props.isAuth ? '/sign-up' : '/sign-in') : '/sign-in'}
            onClick={handleState}
            className={`header__link ${props.isExit && 'header__link_exit'}`}
            href="#">{linkState}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default withRouter(Header);