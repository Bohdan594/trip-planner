import { getMe } from "./api/auth";
import { ApiError } from "./api/errors";
import type { User } from "./utils/userInterface";

type BootstrapResult = {
    user: User | null
    error: string | null
}

export async function bootstrap(): Promise<BootstrapResult> {
    try{
        const user = await getMe();

        return {
            user,
            error: null,
        }

    } catch (err: unknown) {
        if(err instanceof ApiError && err.status === 401){
            return {
                user: null,
                error: null,
            };
        }

        return {
            user: null,
            error:
                err instanceof Error
                    ? err.message
                    : "Something went wrong",
        };
    }
}