/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom"
import { Logo } from "../Login"
import { getToken, logout } from "../services/authentication.service"
import NavigationBar from "./NavigationBar"
import { useEffect, useState } from "react"

export default function Nav({ mainClassName, logoClassName, logoText, profilClassName, isHome, setIsHome }: { mainClassName: string, logoClassName: string, logoText: string, profilClassName: string, isHome: any, setIsHome: any }) {
    const navigate = useNavigate()

    const [isAuthenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        getToken() && setAuthenticated(true)
    }, [])

    const logoutUser = () => {
        logout(navigate)
    }

    const navigateTo = (link: string) => {
        navigate(link)
    }

    return (
        <>
            <nav className={mainClassName}>
                <Logo mainClassName={logoClassName} text={logoText} />
                <NavigationBar
                    navigationBarMainClassName='w-full flex items-center'
                    liClassName='hover:cursor-pointer transition-all mx-2 group text-gray-700 hover:text-gray-800'
                    underlineClassName='w-0 group-hover:w-full group-hover:h-1 group-hover:bg-gray-700 transition-all duration-700'
                    isHome={isHome}
                    setIsHome={setIsHome}
                />

                {
                    isAuthenticated ? (
                        <>
                            <Profil profilClassName={profilClassName} />
                            <button onClick={logoutUser} className="text-gray-700 hover:text-gray-800 px-1 py-1 rounded-md flex items-center justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                            </button>
                        </>
                    ) :
                        (
                            <div className="flex">
                                <button className="text-white h-10 w-28 bg-gray-700 hover:bg-gray-800 px-4 rounded-sm text-sm" onClick={() => { navigateTo('/authentication/login') }}>
                                    <span>Se connecter</span>
                                </button>
                                <button className="text-white h-10 bg-gray-700 hover:bg-gray-800 px-4 ml-2 rounded-sm text-sm" onClick={() => { navigateTo('/authentication/register') }}>
                                    <span>S'incrire</span>
                                </button>
                            </div>
                        )
                }
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