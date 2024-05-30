export interface Meme {
    id: string;
    meme_link: string;
    created_by: string;
}

export interface MemeRequest {
    meme: File
}