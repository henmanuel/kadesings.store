import { useState } from "react"
import {HttpRequest} from "../../../shared/clases/HttpRequest.class";

interface StateFetch {
    data: any,
    isLoading: boolean,
    hasError: any
}

export const useFetch = (url: string, path: string) => {
    const [state, setState] = useState<StateFetch>({
        data: null,
        isLoading: false,
        hasError: null
    });

    const postFetch = async (formState: any) => {
        try {
            
            setState({
                ...state,
                isLoading: true
            });

            const request = new HttpRequest(url);
            const data = await request.post(formState, path, {});

            setState({
                data,
                isLoading: false,
                hasError: null
            });

        } catch (error) {
            setState({
                data: null,
                isLoading: false,
                hasError: error
            });
        }
    }

    return {
        state,
        postFetch
    }
}