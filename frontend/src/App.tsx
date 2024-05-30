import './App.css'
import { Link, Outlet } from "react-router-dom";
import Nav from './components/Nav'
import { useState } from 'react';

function App() {
  const currentURL: string = window.location.href;
  const currentURLTable: string[] = currentURL.split('/');
  const lenOfCurrentURLTable: number = currentURLTable.length;
  const path: string = currentURL.split('/')[lenOfCurrentURLTable - 1];
  const [isHome, setIsHome] = useState((path == 'memes' || path == ''));

  return (
    <>
      <header className=''>
        <Nav
          mainClassName='w-full h-[75px] flex justify-between items-center px-2 mb-2'
          logoClassName=''
          logoText=''
          profilClassName='w-10 h-10 flex items-center justify-center rounded-full'
          isHome={isHome}
          setIsHome={setIsHome}
        />

      </header>
      <main className='px-2 flex'>
        <Outlet />
      </main>
      <Link to={'/create'} >
        <div
          className="fixed hover:cursor-pointer bottom-4 right-4 w-14 h-14 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

        </div>
      </Link>
    </>
  )
}

export default App
