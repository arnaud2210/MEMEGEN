/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { SketchPicker } from 'react-color';
import { Link, useNavigate } from "react-router-dom";
import { MemeRequest } from "./models/memes.model";
import { createMyMeme } from "./services/memes.service";
// import './createMeme.css'

export default function CreateMeme({ mainClassName, cardClassName }: { mainClassName: string, cardClassName: string }) {
    const canvasRef = useRef<any>(null);
    const [image, setImage] = useState<any>(null);
    const [texts, setTexts] = useState<any>([]);
    const [selectedTextIndex, setSelectedTextIndex] = useState<any>(null);
    const [selectedFile, SetSelectedFile] = useState<any>(null)
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [textColor, _] = useState('#ffffff');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            texts.forEach(({ text, position, color, size }: { text: any, position: any, color: any, size: any }) => {
                ctx.font = `${size}px Arial`;
                ctx.fillStyle = color;
                ctx.fillText(text, position.x, position.y);
            });
        }
    }, [image, texts]);

    const handleOnChange = (event: any) => {
        SetSelectedFile(event.target.files[0])

        const img = new Image();
        img.src = URL.createObjectURL(event.target.files[0]);
        img.onload = () => setImage(img);
    }

    const handleAddText = () => {
        setTexts([
            ...texts,
            {
                text: 'New Text',
                position: { x: 50, y: 50 },
                color: '#ffffff',
                size: 30,
            },
        ]);
        setSelectedTextIndex(texts.length);
    };

    const handleTextChange = (event: any) => {
        const newTexts = [...texts];
        newTexts[selectedTextIndex].text = event.target.value;
        setTexts(newTexts);
    };

    const handleTextColorChange = (color: any) => {
        const newTexts = [...texts];
        newTexts[selectedTextIndex].color = color.hex;
        setTexts(newTexts);
    };

    const handleTextSizeChange = (event: any) => {
        const newTexts = [...texts];
        newTexts[selectedTextIndex].size = event.target.value;
        console.log(event.target.value);

        setTexts(newTexts);
    };



    const handleSave = () => {
        setLoading(true);
        const canvas = canvasRef.current;

        canvas.toBlob((blob: any) => {
            const position = selectedFile.name.indexOf('.')
            const file = new File([blob], `${selectedFile.name.substring(0, position) + '-modified' + selectedFile.name.substring(position)}`, { type: selectedFile.type });
            const memeRequest: MemeRequest = {
                meme: file
            }

            createMyMeme(memeRequest, setLoading, navigate);
        });
    }

    const handleMouseDown = (event: any) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const selectedIndex = texts.findIndex(({ position, size, text }: { position: any, size: any, text: any }) => {
            const ctx = canvas.getContext('2d');
            // const textWidth = size * (texts[selectedTextIndex]?.text.length || 1) * 0.6; // Approximation
            const textWidth = ctx.measureText(text).width;
            const textHeight = size;
            return (
                x >= position.x &&
                x <= position.x + textWidth &&
                y >= position.y - textHeight &&
                y <= position.y
            );
        });

        if (selectedIndex !== -1) {
            setSelectedTextIndex(selectedIndex);
            const offsetX = x - texts[selectedIndex].position.x;
            const offsetY = y - texts[selectedIndex].position.y;
            setOffset({ x: offsetX, y: offsetY });
            setDragging(true);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (event: any) => {
        if (dragging && selectedTextIndex !== null) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const newTexts = [...texts];
            newTexts[selectedTextIndex].position = { x: x - offset.x, y: y - offset.y };
            setTexts(newTexts);
        }
    };

    return (
        <>
            <div className={mainClassName}>
                <div className={cardClassName}>
                    <div className="flex flex-col items-center w-1/3 h-full border-r-2 border-r-gray-200 px-2 py-2">
                        <div className="w-full flex my-2">
                            <Link to={'/memes'} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </Link>
                        </div>

                        <div className="relative w-full h-[100px]">
                            <input accept="image/*" onChange={handleOnChange} className="absolute opacity-0 peer w-full h-full hover:cursor-pointer" type="file" name="" id="FileToUpload" />
                            <label htmlFor="FileToUpload" className="w-full h-[100px] my-2">
                                <button type="button" className='bg-gray-700 text-white w-full h-full flex items-center justify-center px-5 rounded-sm border-2 border-gray-700 peer-hover:bg-gray-800'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="ml-2 line-clamp-1">
                                        {
                                            selectedFile ? (selectedFile.name) : ('Aucun fichier téléverser')
                                        }
                                    </p>
                                </button>
                            </label>
                        </div>

                        <div className="w-full my-2">
                            <p className="">Texte: </p>
                            <div className="flex items-center">
                                {
                                    selectedTextIndex != null && image != null ? (
                                        <input className="border w-full h-10 px-2 my-2 text-sm rounded-sm" type="text" value={texts[selectedTextIndex].text} onChange={handleTextChange} name="" id="" />
                                    ) : (
                                        <input className="border w-full h-10 px-2 my-2 text-sm rounded-sm" placeholder="Aucun texte" type="text" disabled={true} name="" id="" />
                                    )
                                }
                                <button className="text-white h-10 bg-gray-700 hover:bg-gray-800 px-4 ml-2 rounded-sm" onClick={handleAddText}>+</button>
                            </div>

                        </div>
                        <div className="w-full my-2">
                            <button disabled={selectedTextIndex == null && image == null} className="bg-gray-700 hover:bg-gray-800 w-full py-2 rounded-sm text-white" onClick={() => setShowColorPicker(!showColorPicker)}>
                                Choisir la couleur du texte
                            </button>
                            {showColorPicker && (
                                <div style={{ position: 'absolute', zIndex: 2, marginTop: 5 }}>
                                    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }} onClick={() => setShowColorPicker(false)} />
                                    <SketchPicker color={textColor} onChange={handleTextColorChange} />
                                </div>
                            )}
                        </div>
                        <div className="w-full my-2">
                            <p>Taille du texte: </p>
                            {
                                selectedTextIndex != null && image != null ? (
                                    <input className="w-full accent-gray-700" type="range" value={texts[selectedTextIndex].size} onChange={handleTextSizeChange} min="10" max="100" />
                                ) : (
                                    <input disabled={true} className="w-full accent-gray-600" type="range" min="10" max="100" />
                                )
                            }

                        </div>

                        <div className="grow flex flex-col justify-end w-full">
                            <button className="bg-gray-700  hover:bg-gray-800 w-full py-2 rounded-sm text-white my-1" onClick={handleSave}>
                                {
                                    isLoading ? (
                                        <div className="w-full flex items-center justify-center" role="status">
                                            <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : ('Enregistrer')
                                }
                            </button>
                        </div>
                    </div>
                    <div className="w-2/3 h-full px-3 py-3">
                        {
                            image ? (
                                <canvas
                                    className="w-full h-full"
                                    ref={canvasRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                >

                                </canvas>
                            ) :
                                (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <p>Veuillez charger une image</p>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}