import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageConverter from './page/download'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ImageConverter></ImageConverter>
    </>
  )
}

export default App
