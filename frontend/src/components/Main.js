import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__info">
          <div className="profile__avatar-container">
            <img className="profile__avatar" src={currentUser.avatar} alt="Avatar" />
            <button className="profile__avatar-button" onClick={props.onEditAvatar}></button>
          </div>
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__job">{currentUser.about}</p>
          <button className="profile__button-edit" type="button" onClick={props.onEditProfile}></button>
        </div>
        <button className="profile__button-add" type="button" onClick={props.onAddPlace}></button>
      </section>
      <section>
        <div className={`${props.isLoading && 'loading'}`}></div>
        <div className="gallery">
          {props.cards.map((item) => (
            <Card key={item._id}
              onCardDelete={props.onCardDelete}
              onCardLike={props.onCardLike}
              card={item}
              onClick={props.onCardClick}
              onDeleteClick={props.onDeleteClick} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Main;