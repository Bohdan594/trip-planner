import { refresh } from './auth'
import { ApiError } from "./errors";

async function httpClient(url: string, options: RequestInit, retry: boolean = true){
    let res: Response

    try {
        res = await fetch(url, options);
    } catch {
        throw new ApiError('Network error, check your internet connection', 0);
    }

    if (res.status === 401 && retry && !url.includes('/auth/refresh') && !url.includes('/auth/signin')) {
        await refresh()
        return httpClient(url, options, false)
    }
    
    let data = null

    try {
        data = await res.json()
    } catch {
        data = null
    }

    if(!res.ok){
        const message = 
            data?.error_description ||
            data?.message ||
            'Something went wrong'

        switch (res.status) {
            case 400:
                throw new ApiError(
                    message || "Invalid email or password",
                    res.status
                );

            case 401:
                throw new ApiError(
                    message || "Unauthorized",
                    res.status
                );

            case 403:
                throw new ApiError(
                    message || "You do not have permission",
                    res.status
                );

            case 404:
                throw new ApiError(
                    message || "Resource not found",
                    res.status
                );

            case 409:
                throw new ApiError(
                    message || "User already exists",
                    res.status
                );

            case 422:
                throw new ApiError(
                    message || "Validation error",
                    res.status
                );

            case 429:
                throw new ApiError(
                    message || "Too many requests, try later",
                    res.status
                );

            case 500:
                throw new ApiError(
                    message || "Server error, try again later",
                    res.status
                );

            case 503:
                throw new ApiError(
                    message || "Server error, try again later",
                    res.status
                );

            default:
                throw new ApiError(
                    message || "Something went wrong",
                    res.status
                );
        }
    }

    return data
}

export default httpClient