/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { deleteMyMeme, getAllMemes } from "../services/memes.service";
import { Profil } from "./Nav";

import Modal from 'react-modal';
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
// import { getImageAsBlob } from "../services/image.service";

export default function Memes({ mainClassName }: { mainClassName: string }) {
    const [memes, setMemes] = useState([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [createdBy, setCreatedBy] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    // @ts-expect-error: Ignorer l'erreur "Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator"
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageStartIndex, setPageStartIndex] = useOutletContext();

    const openModal = (link: string, createdBy: string) => {
        setSelectedImage(link)
        setImageUrl(link)
        setCreatedBy(createdBy)
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedImage!)
        toast.success('lien copié')
    };

    const getSocialShareUrls = (url: string) => {
        return {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            instagram: `https://www.instagram.com/?sharer.php?u=${encodeURIComponent(url)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
        };
    };

    const socialUrls = imageUrl ? getSocialShareUrls(imageUrl) : {};
    
    const handleDownload = () => {
        if (imageUrl) {
            // getImageAsBlob(import.meta.env.VITE_BUCKET_NAME, imageUrl.split('/')[imageUrl.split('/').length - 1])
            //     .then(blob => {
            //         console.log('Image récupérée en tant que blob :', blob);
            //         // Utiliser le blob dans votre application
            //     })
            //     .catch(error => {
            //         console.error('Erreur lors de la récupération de l\'image en tant que blob :', error);
            //     });
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
            getAllMemes(pageStartIndex, pageStartIndex + 9, setMemes)
        }

        fetch()
    })

    return (
        <>
            <div className={mainClassName}>
                {
                    memes.map((value: any) => (
                        <MemeCard openModal={openModal} width={300} id={value.id} meme_link={value.meme_link} created_by={value.created_by} isGallery={false} isClicked={null} setIsClicked={null} isLoading={null} setLoading={null} />
                    ))
                }
            </div>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        width: '900px',
                        height: '600px',
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
                <div className="flex items-center h-full">
                    <img style={{ height: 'auto', width: '400px' }} className="border shadow-md" src={imageUrl!} alt="" />
                    <div className="w-full h-full flex flex-col justify-center px-5">
                        <p className="uppercase text-center mb-5">Créer par : {createdBy}</p>
                        <p className="uppercase text-center mb-5">Partager le meme</p>
                        <div className="flex items-center justify-center relative">
                            <p className="w-7 h-0.5 bg-gray-700 absolute top-3 left-[135px]"></p>
                            <p className="text-center mb-3 mx-1 text-sm">Copié le lien</p>
                            <p className="w-7 h-0.5 bg-gray-700 absolute top-3 right-[135px]"></p>
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
                            <p className="w-7 h-0.5 bg-gray-700 absolute top-3 left-[125px]"></p>
                            <p className="text-center mb-3 mx-1 text-sm">Réseaux sociaux</p>
                            <p className="w-7 h-0.5 bg-gray-700 absolute top-3 right-[125px]"></p>
                        </div>
                        <div className="flex justify-center items-center">
                            <a id="facebookShare" href={socialUrls.facebook} target="_blank" rel="noopener noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 cursor-pointer mx-2" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.87v-6.99H7.9v-2.88h2.54V9.34c0-2.51 1.51-3.89 3.79-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56v1.89h2.78l-.44 2.88h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
                                </svg>
                            </a>
                            {/*<a id="instagramShare" href={socialUrls.instagram} target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-600 cursor-pointer mx-2" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.338 3.608 1.314.975.975 1.252 2.241 1.314 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.338 2.633-1.314 3.608-.975.975-2.241 1.252-3.608 1.314-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.338-3.608-1.314-.975-.975-1.252-2.241-1.314-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.062-1.366.338-2.633 1.314-3.608.975-.975 2.241-1.252 3.608-1.314 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.463.062-2.772.358-3.807 1.393-1.034 1.035-1.33 2.344-1.393 3.807-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.062 1.463.358 2.772 1.393 3.807 1.035 1.034 2.344 1.33 3.807 1.393 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.463-.062 2.772-.358 3.807-1.393 1.034-1.035 1.33-2.344 1.393-3.807.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.062-1.463-.358-2.772-1.393-3.807-1.035-1.034-2.344-1.33-3.807-1.393-1.28-.058-1.688-.072-4.947-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.163c-2.207 0-4-1.793-4-4s1.793-4 4-4 4 1.793 4 4-1.793 4-4 4zm6.406-11.845c-.796 0-1.443.647-1.443 1.443s.647 1.443 1.443 1.443 1.443-.647 1.443-1.443-.647-1.443-1.443-1.443z" />
                                </svg>
                            </a>*/}
                            <a id="twitterShare" href={socialUrls.twitter} target="_blank">
                                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 cursor-pointer mx-2" stroke="none">
                                    <path d="M8.29 20.365c7.547 0 11.675-6.304 11.675-11.758 0-.18 0-.36-.012-.54A8.393 8.393 0 0 0 22 5.836a8.219 8.219 0 0 1-2.348.643 4.073 4.073 0 0 0 1.804-2.248c-.793.46-1.671.796-2.598.973A4.138 4.138 0 0 0 15.922 4c-2.252 0-4.082 1.845-4.082 4.116 0 .324.036.64.098.947-3.395-.178-6.413-1.822-8.434-4.325a4.154 4.154 0 0 0-.558 2.085c0 1.43.73 2.692 1.84 3.433a4.098 4.098 0 0 1-1.858-.51v.051c0 1.996 1.383 3.65 3.22 4.028a4.192 4.192 0 0 1-1.85.07c.521 1.594 2.036 2.758 3.831 2.79a8.365 8.365 0 0 1-5.096 1.676A8.578 8.578 0 0 1 2 18.338a11.754 11.754 0 0 0 6.29 1.827"></path>
                                </svg>
                            </a>
                            <a id="telegramShare" href={socialUrls.telegram} target="telegram">
                                <svg  viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 cursor-pointer mx-2" stroke="none">
                                    <path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17.6057 7.06263L15.3073 16.274C15.1125 17.067 14.638 17.2582 14.0047 16.912L11.0842 14.8986L9.78454 16.1548C9.57482 16.3646 9.40159 16.5382 9.01664 16.5382L9.18887 13.5843L15.3215 8.31397C15.5761 8.11495 15.2756 7.99311 14.9498 8.19386L7.78143 12.5904L4.91129 11.6933C4.14159 11.4305 4.1242 10.8925 4.99746 10.5516L16.4641 6.18174C17.0886 5.94612 17.6035 6.28937 17.6057 7.06263Z"/>
                                </svg> 
                            </a>
                            <a id="whatsappShare" href={socialUrls.whatsapp} target="_blank">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-700 cursor-pointer mx-2" stroke="none">
                                    <path d="M12 0C5.373 0 0 5.373 0 12C0 17.312 3.438 21.738 8 23.154V24C8 24.553 8.447 25 9 25C9.276 25 9.551 24.897 9.771 24.707L12 22.586L14.229 24.707C14.449 24.897 14.724 25 15 25C15.553 25 16 24.553 16 24V23.154C20.563 21.738 24 17.312 24 12C24 5.373 18.627 0 12 0ZM12 21.856L10.172 20.029C10.077 19.933 9.961 19.878 9.836 19.878C9.712 19.878 9.596 19.933 9.5 20.029L7.8 21.738C5.341 20.506 3.698 17.978 3.698 15.126C3.698 9.93 7.932 5.696 13.126 5.696C18.32 5.696 22.554 9.93 22.554 15.126C22.554 17.978 20.911 20.506 18.452 21.738L16.771 20.029C16.675 19.933 16.559 19.878 16.434 19.878C16.309 19.878 16.194 19.933 16.098 20.029L14.271 21.856C13.854 22.273 13.146 22.273 12.729 21.856L12 21.856Z"/>
                                </svg>
                            </a>
                        </div>
                        <div className="h-0.5 w-full bg-gray-700 my-2"></div>
                        <button onClick={handleDownload} type="button" className="bg-gray-700  hover:bg-gray-800 w-full py-2 rounded-sm text-white my-1">Télécharger l'image</button>
                    </div>
                </div>

            </Modal>
        </>
    )
}

export function MemeCard({ id, meme_link, created_by, width, openModal, isGallery, isClicked, setIsClicked, isLoading, setLoading }: { id: string, meme_link: string, created_by: string, width: number, openModal: any, isGallery: boolean, isClicked: any, setIsClicked: any, isLoading: any, setLoading: any }) {
    return (

        <>
            <div key={id} className='border rounded-lg mx-2 my-2 hover:scale-105 shadow-lg'>
                {/* TODO: on click go to detail of the main(We can use modal instead of opening a new page) */}
                <img onClick={() => { openModal(meme_link, created_by) }} className="rounded-t-lg cursor-pointer" src={meme_link} width={width} style={{ height: '85%' }} alt="une image" />
                <div className="flex h-[15%] items-center justify-between px-2">
                    <div className="flex items-center justify-start">
                        <Profil profilClassName='flex items-center justify-center rounded-full' />
                        <div className="ml-2 w-full h-full flex items-center justify-center">
                            <p className="text-center">{created_by}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {
                            isGallery && <div className="relative mr-2">
                                {
                                    !isClicked ? (
                                        <svg onClick={() => { setIsClicked(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    ) : (
                                        <div className="flex border py-2 px-1">
                                            {
                                                isLoading ? (
                                                    <>
                                                        <div className="w-full flex items-center justify-center" role="status">
                                                            <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                            </svg>
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg onClick={() => { setIsClicked(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2 hover:text-white hover:bg-gray-700 hover:cursor-pointer">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                        <svg onClick={() => { deleteMyMeme(id, setLoading); setIsClicked(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:text-white hover:bg-gray-700 hover:cursor-pointer">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    </>
                                                )
                                            }
                                        </div>

                                    )
                                }

                                <div className="absolute right-0 top-7 hidden peer-hover:flex bg-gray-700 py-1 text-sm text-white w-44 items-center justify-center rounded-sm">
                                    Share with your friends
                                    <div className="w-0 h-0 border border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-gray-700 absolute right-0 -top-2"></div>
                                </div>
                            </div>
                        }
                        <div onClick={() => { openModal(meme_link, created_by) }} className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer peer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                            <div className="absolute right-0 top-7 hidden peer-hover:flex bg-gray-700 py-1 text-sm text-white w-44 items-center justify-center rounded-sm">
                                Share with your friends
                                <div className="w-0 h-0 border border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-gray-700 absolute right-0 -top-2"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >


            {/* <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="flex items-center mt-4">
                    <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div> */}

        </>
    );
}

