/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getMyMemes } from "../services/memes.service";
import { MemeCard } from "./Memes";
import { toast } from "sonner";
import Modal from 'react-modal';
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function Create({ mainClassName }: { mainClassName: string }) {
    const [myMemes, setMyMemes] = useState<JSX.Element[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [createdBy, setCreatedBy] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setLoading] = useState(false);
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

    const handleDownload = async () => {
        if (imageUrl) {
            const response = await axios.get(imageUrl, {
                headers: {
                    mode: 'cors',
                    'access-control-allow-origin': '*',
                    'content-type': 'image/jpeg'
                }
            })
            console.log(response);

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
            getMyMemes(pageStartIndex, pageStartIndex + 9, setMyMemes)
        }

        fetch()
    })

    return (
        <>
            <div className={mainClassName}>
                {
                    myMemes.map((value: any) => (
                        <MemeCard openModal={openModal} width={300} id={value.id} meme_link={value.meme_link} created_by={value.created_by} isGallery={true} isClicked={isClicked} setIsClicked={setIsClicked} isLoading={isLoading} setLoading={setLoading} />
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