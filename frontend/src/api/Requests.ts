import axios from "axios";

export interface RequestInformation {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    data?: any;
}

export interface AxiosErrorResponse {
    error: boolean;
    status?: number;
    message: string;
    data?: any;
}

export const sendBackEndRequest = async (req: RequestInformation) => {
    try {
        const baseUrl = import.meta.env.VITE_APP_API_URL || '';
        const url = `${baseUrl}/${req.path}`;

        switch (req.method.toLowerCase()) {
            case "get": {
                const response =  await axios.get(url);
                return  response.data;
            }
            case "post": {
                const response = await axios.post(url, req.data);
                return response.data;
            }
            case "put": {
                const response = await axios.put(url, req.data);
                return response.data;
            }
            case "delete": {
                const response = await axios.delete(url, { data: req.data });
                return response.data;
            }
            default: {
                throw new Error("Invalid request method");
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                error: true,
                status: error.response?.status,
                message: error.message,
                data: error.response?.data
            } as AxiosErrorResponse;
        }
        return {
            error: true,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        } as AxiosErrorResponse;
    }
};
