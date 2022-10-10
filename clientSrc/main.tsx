import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './Index'
import './main.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Cars from './components/Cars'
import {RecoilRoot} from 'recoil'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/cars',
    element: <Cars />,
    loader: () => fetch('/api/cars'),
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
)
