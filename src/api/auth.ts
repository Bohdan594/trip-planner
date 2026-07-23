import httpClient from "./httpClient"

const BASE_URL = import.meta.env.VITE_API_URL;

export async function signUp(email: string, password: string){
    return httpClient(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    })
}

export async function signIn(email: string, password: string){
    return httpClient(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
}

export async function signOut() {
    return httpClient(`${BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
    })
}

export async function refresh() {
    return httpClient(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', 
    })
}

export async function getMe() {
    return httpClient(`${BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
    })
}

export async function forgotPassword(email: string) {
    return httpClient(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
}

export async function resetPassword(password: string, accessToken: string) {
    return httpClient(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, accessToken }),
    })
}

export async function deleteAccount() {
    return httpClient(`${BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        credentials: 'include',
    })
}