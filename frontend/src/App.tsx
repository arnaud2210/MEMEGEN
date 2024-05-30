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
  const [page, setPage] = useState(1)
  const [pageStartIndex, setPageStartIndex] = useState(0)

  const plus = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      if (newPage > 1) {
        setPageStartIndex((prevIndex) => prevIndex + 9);
      }
      return newPage;
    });
  };

  const minus = () => {
    setPage((prevPage) => {
      if (prevPage > 1) {
        const newPage = prevPage - 1;
        setPageStartIndex((prevIndex) => prevIndex - 9);
        return newPage;
      } else {
        setPageStartIndex(0);
        return prevPage;
      }
    });
  };

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
        <Outlet context={[pageStartIndex, setPageStartIndex]} />
      </main>
      <Link to={'/create'} className='inline-block' >
        <div
          className="fixed hover:cursor-pointer bottom-4 right-4 w-14 h-14 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

        </div>
      </Link>
      
      <div
        className="fixed bottom-4 right-0 w-full h-10  flex items-center justify-center transition-colors"
      >
        <div className='w-36 border border-gray-700 flex items-center justify-between h-10 rounded-lg p-0'>

          <div onClick={minus} className='h-full text-white bg-gray-700 hover:bg-gray-800 cursor-pointer flex items-center justify-center px-2 rounded-l-lg border border-gray-700'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </div>
          <span className='h-full px-3 text-center flex items-center'>{page}</span>
          <div onClick={plus} className='h-full text-white bg-gray-700 hover:bg-gray-800 cursor-pointer flex items-center justify-center px-2 rounded-r-lg border border-gray-700'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
