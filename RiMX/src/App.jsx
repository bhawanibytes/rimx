import {BrowserRouter, Route, Routes } from 'react-router-dom'
import RiMXLandingPage from './pages/RiMXLandingPage'
import Signup from './pages/Signup'
// import AdminPanel from './components/AdminPanel'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import WelcomePage from './pages/WelcomePage'
// import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <main style={{ marginTop: '60px' }}>
         <BrowserRouter>
         {/* <AuthProvider> */}
    <Navbar/>
    
    <Routes>
      <Route path="/" element={<RiMXLandingPage/>}/>
      {/* <Route path="/AdminPanel" element={<AdminPanel/>}/> */}
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<LoginForm/>}/>
      <Route path='/WelcomePage' element={<WelcomePage/>}/>
    </Routes>
    <Footer/> 
    {/* </AuthProvider> */}
    </BrowserRouter>
      </main>
  )
}

export default App
