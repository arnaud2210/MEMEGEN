/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logo } from "../Login"
import NavigationBar from "./NavigationBar"

export default function Nav({ mainClassName, logoClassName, logoText, profilClassName, isHome, setIsHome }: { mainClassName: string, logoClassName: string, logoText: string, profilClassName: string, isHome: any, setIsHome: any }) {
    return (
        <>
            <nav className={mainClassName}>
                <Logo mainClassName={logoClassName} text={logoText} />
                <NavigationBar
                    navigationBarMainClassName='w-full flex justify-center'
                    liClassName='hover:cursor-pointer transition-all mx-2 group text-gray-700 hover:text-gray-800'
                    underlineClassName='w-0 group-hover:w-full group-hover:h-1 group-hover:bg-gray-700 transition-all duration-700'
                    isHome={isHome}
                    setIsHome={setIsHome}
                />
                {/* TODO: Component Profil */}
                <Profil profilClassName={profilClassName} />
            </nav>
        </>
    )
}

export function Profil({ profilClassName }: { profilClassName: string }) {
    return (
        <>
            <div className={profilClassName}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </div>
        </>
    );
}