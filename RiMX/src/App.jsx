import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './features/slices/authSlice';
import RiMXLandingPage from './pages/RiMXLandingPage';
import Signup from './pages/Signup';
import Terms from './components/Terms';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import ContactPage from './components/ContactPage';
import DemoPage from './components/DemoPage';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Teams from './components/Teams';
import Welcomepage from './pages/WelcomePage';
import OrganizationDashboard from './pages/OrganizationDashboard';
import UserProfile from './components/UserProfile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <main style={{ marginTop: '60px' }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<RiMXLandingPage />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route
            path="/WelcomePage"
            element={
              <PrivateRoute>
                <Welcomepage />
              </PrivateRoute>
            }
          />
          <Route
            path="/OrganizationDashboard"
            element={
              <PrivateRoute>
                <OrganizationDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/DemoPage" element={<DemoPage />} />
          <Route path="/Features" element={<Features />} />
          <Route path="/Pricing" element={<Pricing />} />
          <Route path="/Teams" element={<Teams />} />
          <Route
            path="/Dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </main>
  );
};

export default App;
