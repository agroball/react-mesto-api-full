export const BASE_URL = 'https://api.agroball.sharli.nomoredomains.club';

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
        .then(res => {
            if (!res.ok) {
                return Promise.reject(res.status)
            } else {
                console.log(res)
                return res.json();
            }
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
        .then(res => {
            if (!res.ok) {
                return Promise.reject(res.status)
            }
        })
};

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