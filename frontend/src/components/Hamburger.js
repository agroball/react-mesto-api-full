import React from 'react';
import { Link, withRouter } from 'react-router-dom';

export const Hamburger = (props) => {

	const isHamburgerVisible = props.isHamburger && props.loggedIn;

	return (
		<>
			{isHamburgerVisible && <div className="header__wrapper_hamburger">
				<p className="header__email_hamburger">{props.email}</p>
				<Link
					to=""
					className="header__link header__link_exit"
					onClick={props.onHandleState}>
					{props.linkState}
				</Link>
			</div>}
			{props.loggedIn && <header className="header__hamburger">
				<div className="header__logo"></div>
				<button className={`header__menu ${props.isHamburger && 'header__menu_exit'}`} onClick={props.onSetHamburger}></button>
			</header>}
		</>
	);
}

export default withRouter(Hamburger);