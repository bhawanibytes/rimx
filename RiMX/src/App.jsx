import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

const PrivateRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If roles are specified, check if the user's role is allowed
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/WelcomePage" />;
  }

  return children;
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
        </Routes>
        <Footer/> 
      </Router>
    </main>
  )
}

export default App
