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
                        <div className="flex justify-center items-center">
                            <a id="facebookShare" href={socialUrls.facebook} target="_blank" rel="noopener noreferrer">
                                <span className="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-[#1877f2] mx-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path
                                        d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                    </svg>
                                </span>
                            </a>
                            <a id="instagramShare" href={socialUrls.instagram} target="_blank">
                                <span className="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-[#c13584] mx-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path
                                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                    </svg>
                                </span>
                            </a>
                            <a id="telegramShare" href={socialUrls.telegram} target="telegram">
                                <span className="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-[#0088cc] mx-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                        <path
                                        d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
                                    </svg>
                                </span>
                            </a>
                            <a id="twitterShare" href={socialUrls.twitter} target="_blank">
                            <span className="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-black mx-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 512 512">
                                    <path
                                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                </svg>
                            </span>
                            </a>
                            <a id="whatsappShare" href={socialUrls.whatsapp} target="_blank">
                                <span className="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-[#128c7e] mx-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 448 512">
                                        <path
                                        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                    </svg>
                                </span>
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
                                Partager avec..
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

