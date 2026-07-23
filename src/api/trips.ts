import httpClient from "./httpClient";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getTrips(){
    return httpClient(`${BASE_URL}/trips`, {
        method: 'GET',
        credentials: 'include'
    });
}

export async function createTrip(
    departure_city: string,
    cities: string[],
    days: number,
    people: number,
    budget: number,
){
    return httpClient(`${BASE_URL}/trips`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            departure_city,
            cities,
            days,
            people,
            budget
        })
    });
}