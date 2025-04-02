import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RiMXLandingPage from './pages/RiMXLandingPage'
import Signup from './pages/Signup'
import Terms from './components/Terms'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import ContactPage from './components/ContactPage'
import DemoPage from './components/DemoPage'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Teams from './components/Teams'
import Welcomepage from './pages/WelcomePage'
import OrganizationDashboard from './pages/OrganizationDashboard'   

const App = () => {
  return (
    <main style={{ marginTop: '60px' }}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<RiMXLandingPage/>}/>
          <Route path="/Terms" element={<Terms/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/ContactPage' element={<ContactPage/>}/>
          <Route path='/WelcomePage' element={<Welcomepage/>}/>
          <Route path='/OrganizationDashboard' element={<OrganizationDashboard/>}/>
          <Route path='/DemoPage' element={<DemoPage/>}/>
          <Route path='/Features' element={<Features/>}/>
          <Route path='/Pricing' element={<Pricing/>}/>
          <Route path='/Teams' element={<Teams/>}/>
          {/* <Route path="/organizations/:orgId" element={<OrganizationDashboard />} /> */}
        </Routes>
        <Footer/> 
      </Router>
    </main>
  )
}

export default App
