/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getMyMemes } from "../services/memes.service";
import { MemeCard } from "./Memes";

export default function Create({ mainClassName }: { mainClassName: string }) {
    const [myMemes, setMyMemes] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetch = () => {
            getMyMemes(0, 10, setMyMemes)
        }

        fetch()
    })

    return (
        <>
            <div className={mainClassName}>
                {
                    myMemes.map((value: any) => (
                        <MemeCard openModal={true} width={300} id={value.id} meme_link={value.meme_link} created_by={value.created_by} />
                    ))
                }
            </div>
        </>
    )
}