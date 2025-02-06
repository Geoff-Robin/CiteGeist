import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './index.css'
import Login from './Pages/login'
import SignUp from './Pages/sign-up'
import Home from './Pages/home'
import About from './Pages/About'
import { AuthContextProvider } from './store/auth-context'
import ResearchPaper from './Pages/ResearchPaper'
import NotFound from './Pages/404'
import Search from './Pages/Search'
import PdfSearch from './Pages/PdfSearch'
const router=createBrowserRouter([
  {
    path:"/",
    element:<About/>
  },
  {
    path:"/signup",
    element:<SignUp/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/home",
    element:<Home/>
  },
  {
    path:"/paper/:id",
    element:<ResearchPaper/>
  },
  {
    path:"/search",
    element:<Search/>
  },
  {
    path:"/pdf",
    element:<PdfSearch/>
  },
  {
    path:"/test",
    element:<NotFound/>
  },
  {
    path:"*",
    element:<NotFound/>
  },
])


createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
      <RouterProvider router={router} />
  </AuthContextProvider>
)
