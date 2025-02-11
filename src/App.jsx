import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
