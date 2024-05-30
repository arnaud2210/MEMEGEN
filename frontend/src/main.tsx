import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Memes from './components/Memes.tsx';
import Create from './components/Create.tsx';
import CreateMeme from './CreateMeme.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';
import { Toaster } from 'sonner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <>
      <App />
      <Toaster richColors expand={true} position='top-right' />
    </>,
    children: [
      {
        path: '/',
        element: <Navigate to="/memes" replace />
      },
      {
        path: 'memes',
        element: <Memes mainClassName='flex flex-wrap justify-center py-5' />
      },
      {
        path: 'creations',
        element: <Create mainClassName='flex flex-wrap justify-center py-5' />
      }
    ]
  },
  {
    path: '/create',
    element: <>
      <CreateMeme
        mainClassName='flex items-center justify-center w-full h-screen'
        cardClassName='w-full h-full sm:w-2/3 sm:h-[650px] border border-2 rounded-lg shadow-lg flex'
      />
      <Toaster richColors expand={true} position='top-right' />
    </>
  },
  {
    path: '/authentication',
    element: <>
      <Outlet />
      <Toaster richColors expand={true} position='top-right' />
    </>,
    children: [
      {
        path: 'login',
        element: <Login
          mainClassName='h-screen w-full flex items-center justify-center'
          cardClassName='w-full h-full sm:h-[500px] sm:w-[450px] border shadow-lg rounded-md flex flex-col items-center justify-center px-5'
          logoMainClassName='h-10 w-10 bg-gray-700 rounded-full mb-2 flex items-center justify-center text-white font-bold'
          logoText='MG'
        />
      },
      {
        path: 'register',
        element: <Register
          mainClassName='h-screen w-full flex items-center justify-center'
          cardClassName='w-full h-full sm:h-[500px] sm:w-[450px] border shadow-lg rounded-md flex flex-col items-center justify-center px-5'
          logoMainClassName='h-10 w-10 bg-gray-700 rounded-full mb-2 flex items-center justify-center text-white font-bold'
          logoText='MG'
        />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
