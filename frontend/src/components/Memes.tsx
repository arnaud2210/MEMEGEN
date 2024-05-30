/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { getAllMemes } from "../services/memes.service";
import { Profil } from "./Nav";

import Modal from 'react-modal';
import { toast } from "sonner";

export default function Memes({ mainClassName }: { mainClassName: string }) {
    const [memes, setMemes] = useState([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (id: string, link: string) => {
        setSelectedImage(`${import.meta.env.VITE_SITE_URL}/memes/${id}`)
        setImageUrl(link)
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedImage!)
        toast.success('lien copié')
    }

    const handleDownload = () => {
        if (imageUrl) {

            const link = document.createElement('a');
            link.href = imageUrl;

            link.download = imageUrl.split('/')[imageUrl.split('/').length - 1];
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
        }
    };

    useEffect(() => {
        const fetch = () => {
            getAllMemes(0, 10, setMemes)
        }

        fetch()
    })

    return (
        <>
            <div className={mainClassName}>
                {
                    memes.map((value: any) => (
                        <MemeCard openModal={openModal} width={300} id={value.id} meme_link={value.meme_link} created_by={value.created_by} />
                    ))
                }
            </div>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        width: '450px',
                        height: '370px',
                        margin: 'auto',
                        overflow: "hidden"
                    }
                }}
            >
                <div>
                    <button onClick={closeModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="w-full h-full flex flex-col justify-center">
                    <p className="uppercase text-center mb-5">Partager le meme</p>
                    <div className="flex items-center justify-center relative">
                        <p className="w-7 h-0.5 bg-gray-700 absolute top-2 left-[135px]"></p>
                        <p className="text-center mb-3 mx-1 text-sm">Copié le lien</p>
                        <p className="w-7 h-0.5 bg-gray-700 absolute top-2 right-[135px]"></p>
                    </div>
                    <div className="flex w-full mt-2 mb-4">
                        {selectedImage && <input type="text" value={selectedImage} disabled className="border w-full h-10 px-3" />}
                        <div onClick={copyToClipboard} className="px-3 border h-10 flex items-center justify-center ml-2 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-center relative">
                        <p className="w-7 h-0.5 bg-gray-700 absolute top-2 left-[120px]"></p>
                        <p className="text-center mb-3 mx-1 text-sm">Réseaux sociaux</p>
                        <p className="w-7 h-0.5 bg-gray-700 absolute top-2 right-[120px]"></p>
                    </div>
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 cursor-pointer" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.87v-6.99H7.9v-2.88h2.54V9.34c0-2.51 1.51-3.89 3.79-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56v1.89h2.78l-.44 2.88h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-600 cursor-pointer" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                            <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.338 3.608 1.314.975.975 1.252 2.241 1.314 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.338 2.633-1.314 3.608-.975.975-2.241 1.252-3.608 1.314-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.338-3.608-1.314-.975-.975-1.252-2.241-1.314-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.062-1.366.338-2.633 1.314-3.608.975-.975 2.241-1.252 3.608-1.314 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.463.062-2.772.358-3.807 1.393-1.034 1.035-1.33 2.344-1.393 3.807-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.062 1.463.358 2.772 1.393 3.807 1.035 1.034 2.344 1.33 3.807 1.393 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.463-.062 2.772-.358 3.807-1.393 1.034-1.035 1.33-2.344 1.393-3.807.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.062-1.463-.358-2.772-1.393-3.807-1.035-1.034-2.344-1.33-3.807-1.393-1.28-.058-1.688-.072-4.947-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.163c-2.207 0-4-1.793-4-4s1.793-4 4-4 4 1.793 4 4-1.793 4-4 4zm6.406-11.845c-.796 0-1.443.647-1.443 1.443s.647 1.443 1.443 1.443 1.443-.647 1.443-1.443-.647-1.443-1.443-1.443z" />
                        </svg>
                    </div>
                    <div className="h-0.5 w-full bg-gray-700 my-2"></div>
                    <button onClick={handleDownload} type="button" className="bg-gray-700  hover:bg-gray-800 w-full py-2 rounded-sm text-white my-1">Télécharger l'image</button>
                </div>

            </Modal>
        </>
    )
}

export function MemeCard({ id, meme_link, created_by, width, openModal }: { id: string, meme_link: string, created_by: string, width: number, openModal: any }) {
    return (
        <div key={id} className='border rounded-lg mx-2 my-2 hover:scale-105 shadow-lg'>
            {/* TODO: on click go to detail of the main(We can use modal instead of opening a new page) */}
            <img src={meme_link} width={width} style={{ height: '85%' }} alt="une image" />
            <div className="flex h-[15%] items-center justify-between px-2">
                <div className="flex items-center justify-start">
                    <Profil profilClassName='flex items-center justify-center rounded-full' />
                    <div className="ml-2 w-full h-full flex items-center justify-center">
                        <p className="text-center">{created_by}</p>
                    </div>
                </div>
                <div onClick={() => { openModal(id, meme_link) }} className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer peer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                    <div className="absolute right-0 top-7 hidden peer-hover:flex bg-blue-800 py-1 text-sm text-white w-44 items-center justify-center rounded-sm">
                        Share with your friends
                        <div className="w-0 h-0 border border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-blue-800 absolute right-0 -top-2"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
