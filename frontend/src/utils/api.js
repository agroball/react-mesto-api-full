class Api {
  constructor(baseUrl, contentType) {
    this.baseUrl = baseUrl;
    this.contentType = contentType;
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }
  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'GET',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      }
    })
      .then(this._checkResponse)
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      }
    })
      .then(this._checkResponse)
  }

  setUserInfo(newName, newAbout, token) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      },
      body: JSON.stringify({
        name: newName,
        about: newAbout
      })
    })
      .then(this._checkResponse)
  }

  addCard(name, link) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      },
      body: JSON.stringify({
        name: name,
        link: link
      })

    })
      .then(this._checkResponse)

  }
  deleteCard(cardId, token) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      },

    })
      .then(this._checkResponse)
  }
  updateAvatarImage(imageUrl) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      },
      body: JSON.stringify({
        avatar: imageUrl
      })
    })
      .then(this._checkResponse)
  }
  addLike(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      }

    })
      .then(this._checkResponse)
  }
  removeLike(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers:{
        'Content-Type': this.contentType,
      }

    })
      .then(this._checkResponse)
  }
  changeLikeCardStatus(cardId, isLiked, token) {
    if (isLiked) {
      return this.addLike(cardId, token)
    } else {
      return this.removeLike(cardId, token)
    }
  }
}
export const api = new Api(
 'https://api.hakuna.matata.nomoredomains.monster',
 'application/json'
);