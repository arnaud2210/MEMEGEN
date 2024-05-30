import { Link } from "react-router-dom";

export default function NavigationBar({ navigationBarMainClassName, liClassName, underlineClassName, isHome, setIsHome }: { navigationBarMainClassName: string, liClassName: string, underlineClassName: string, isHome: boolean, setIsHome: CallableFunction }) {
    return (
        <>
            <ul className={navigationBarMainClassName}>
                <li className={liClassName}>
                    <Link to={'/memes'} reloadDocument={false} onClick={() => {
                        setIsHome(!isHome)
                    }}>
                        <Underline text='Accueil' isHome={isHome} className={underlineClassName} />
                    </Link>
                </li>
                <li className={liClassName}>
                    <Link to={'/creations'} reloadDocument={false} onClick={() => {
                        setIsHome(!isHome)
                    }}>
                        <Underline text='Galerie' isHome={!isHome} className={underlineClassName} />
                    </Link>
                </li>
            </ul>
        </>
    );
}

export function Underline({ className, isHome, text }: { className: string, isHome: boolean, text: string }) {
    return (
        <>
            {
                isHome ? (
                    <>
                        <span className='font-semibold'>{text}</span>
                        <div className='w-full h-1 bg-gray-700'>
                        </div>
                    </>
                ) : (
                    <>
                        <span>{text}</span>
                        <div className={className}>
                        </div>
                    </>
                )
            }
        </>
    );
}