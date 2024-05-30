/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner"
import client from "./authentication.service"
import { MemeRequest } from "../models/memes.model"

export const getAllMemes = async (start: number, end: number, setMemes: any) => {
    try {
        const memes = await client.get(`memes/public?start=${start}&end=${end}`);

        setMemes(memes.data);
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        }
    }
}

export const getMyMemes = async (start: number, end: number, setMyMemes: any) => {
    try {
        const response = await client.get(`memes/all?start=${start}&end=${end}`);
        setMyMemes(response.data);
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        }
    }
}

export const createMyMeme = async (meme: MemeRequest, setLoading: any, navigate: any) => {
    try {
        const formData = new FormData();
        formData.append('meme_file', meme.meme, meme.meme.name)

        await client.post('meme/create', formData)

        toast.success('Meme created successfully !');

        setLoading(false);
        navigate('/creations');
    } catch (error: any) {
        toast.error(error.response.data.detail);
        setLoading(false);
    }
}

export const deleteMyMeme = async (id: string, setLoading: any) => {
    try {
        setLoading(true);

        await client.delete(`meme/${id}`)

        toast.success('Meme delete successfully !');

        setLoading(false);
    } catch (error: any) {
        toast.error(error.response.data.detail);
        setLoading(false);
    }
}