const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function searchCities(query: string){
    let res: Response;

    try {
        res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                query
            )}&type=city&limit=10&apiKey=${API_KEY}`
        );
    } catch {
        throw new Error('Network error, check your internet connection');
    }

    let data = null;

    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            'Failed to fetch cities'
        );
    }

    return data;
}