export const BASE_URL = 'https://agroball.sharli.nomoredomains.work';

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })
};

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then((res) => {
            if (res.status === 400) {
                throw new Error('Не все поля заполнены');
            } else if (res.status === 401) {
                throw new Error('Email не зарегистрирован');
            } else return res.json();
        })
        .then((data) => {
            console.log(data)
            if (data.token) {
                localStorage.setItem('jwt', data.token);
                return data.token;
            }
        })
}

export const checkToken = () => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (!res.ok) {
                return Promise.reject(res.status)
            } else {
                return res.json();
            }
        })
};
export const signOut = () => {
    return fetch(`${BASE_URL}/users/me/signout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (!res.ok) {
                return Promise.reject(res.status)
            }
        })
};

export const getContent = (token) => {return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
})
    .then((res) => {
        return res.json()
    })
    .then((data) => data)
}