// AuthContext for login state
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('token');
      
      // If no token, we're not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      // If we have a token, validate it
      try {
        const response = await api.get('/auth/me');
        if (response.data?.success) {
          const userData = response.data.data;
          setUser({
            id: userData._id || userData.id,
            email: userData.email,
            role: userData.role,
            name: userData.name
          });
        } else {
          // Invalid token, clear it
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data && response.data.success) {
        const { data } = response.data;
        console.log('Login successful, setting token and user data');
        localStorage.setItem('token', data.token);
        // Set the user object with the data from the response
        const userData = {
          id: data.id || data._id,
          email: data.email,
          name: data.name,
          role: data.role
        };
        console.log('Setting user data:', userData);
        setUser(userData);
        return { success: true };
      } else {
        const errorMsg = response.data?.message || 'Invalid response from server';
        console.error('Login failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;