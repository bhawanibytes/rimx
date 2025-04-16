import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
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
import UserProfile from './components/UserProfile'
import Dashboard from './pages/Dashboard';
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
          <Route path ='/UserProfile' element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
          <Route 
            path='/WelcomePage' 
            element={
              <PrivateRoute>
                <Welcomepage/>
              </PrivateRoute>
            }
          />
          <Route 
            path='/OrganizationDashboard' 
            element={
              // <PrivateRoute roles={['owner', 'employee','member','teamlead','projectManager']}>
                <OrganizationDashboard/>
              // </PrivateRoute>
            }
          />
          <Route path='/DemoPage' element={<DemoPage/>}/>
          <Route path='/Features' element={<Features/>}/>
          <Route path='/Pricing' element={<Pricing/>}/>
          <Route path='/Teams' element={<Teams/>}/>
          <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
        <Footer/> 
      </Router>
    </main>
  )
}

export default App
