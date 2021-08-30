class Api {
    constructor(baseUrl, contentType) {
        this.baseUrl = baseUrl;
        this.contentType = contentType;
    }

    getInitialCards() {
        return fetch(`${this.baseUrl}/cards`, {
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            }
            })
            .then(this._checkResult)
    }

    getUserInfo() {
        return fetch(`${this.baseUrl}/users/me`, {
                method: 'GET',
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            }
            })
            .then(this._checkResult)

    }

    setUserInfo(newName, newAbout, token) {
        return fetch(`${this.baseUrl}/users/me`, {
                method: "PATCH",
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            },
                body: JSON.stringify({
                    name: newName,
                    about: newAbout
                })
            })
            .then(this._checkResult)

    }

    updateAvatarImage(data) {
        return fetch(`${this.baseUrl}/users/me/avatar`, {
                method: 'PATCH',
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            },
                body: JSON.stringify(data)
            })
            .then(this._checkResult)

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
            .then(this._checkResult)

    }

    deleteCard(cardId, token) {
        return fetch(`${this.baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            },

        })
            .then(this._checkResult)

    }

    addLike(cardId) {
        return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            }

        })
            .then(this._checkResult)

    }
    removeLike(cardId) {
        return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            credentials: 'include',
            headers:{
                'Content-Type': this.contentType,
            }
        })
            .then(this._checkResult)

    }

    _checkResult(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`);
    };

    changeLikeCardStatus(cardId, isLiked, token) {
        if (isLiked) {
            return this.addLike(cardId, token)
        } else {
            return this.removeLike(cardId, token)
        }
    };

}

export const api = new Api(
    'https://api.agroball.sharli.nomoredomains.club',
    'application/json'
);

// fetch('https://mesto.nomoreparties.co/v1/cohort-20/cards', {
//         headers: {
//             authorization: 'dc63b407-867c-4698-ab85-c3ed97052e84'
//         }
//     })
//     .then(res => res.json())
//     .then((result) => {
//         console.log(result);
//     });