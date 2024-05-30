/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";
import { LoginRequest, RegisterRequest } from "../models/authentication.model";
import { toast } from "sonner";

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

client.interceptors.request.use(
    (config: any) => {
        if (config.url.includes('memes/all') || config.url.includes('meme/create') || config.url.includes('meme/')) {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            else {
                toast.error('Not authenticated');

                setTimeout(() => {
                    window.location.href = '/authentication/login';
                }, 1500);
            }
        }
        return config;

    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export const login = async (loginRequest: LoginRequest, navigate: any, setLoading: any) => {
    try {
        const response = await client.post('auth/login', loginRequest);
        saveToken(response.data.token);
        setLoading(false);
        toast.success('Welcome Back ' + response.data.username + ' !');
        navigate('/memes');
    } catch (error: any) {
        setLoading(false);
        toast.error(error.response.data.detail);
    }
}

export const register = async (registerRequest: RegisterRequest, navigate: any, setLoading: any) => {
    try {
        await client.post('auth/register', registerRequest);
        toast.success('You can now log in !');
        setLoading(false);
        navigate('/authentication/login');
    } catch (error: any) {
        setLoading(false);
        if (error.response.status == 422) {
            toast.error(error.response.data.detail[0].msg);
        } else {
            toast.error(error.response.data.detail);
        }
    }
}

export const getToken = () => sessionStorage.getItem(import.meta.env.VITE_SESSION_NAME)

export const logout = (navigate: any) => {
    sessionStorage.removeItem(import.meta.env.VITE_SESSION_NAME)
    toast.success('Vous vous êtes déconnecté')
    navigate('/authentication/login')
}

const saveToken = (token: string) => {
    sessionStorage.setItem(import.meta.env.VITE_SESSION_NAME, token)
}



export default client;