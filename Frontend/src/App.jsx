import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import About from './Pages/About'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <About></About>
    </>
  )
}

export default App
