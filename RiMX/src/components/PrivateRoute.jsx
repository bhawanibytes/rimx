import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is logged in

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;