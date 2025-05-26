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
    const token = localStorage.getItem('token');
    if (token) {
      const validateToken = async () => {
        try {
          const response = await api.get('/auth/me');
          if (response.data && response.data.success) {
            const userData = response.data.data;
            // Set the user object with the data from the response
            setUser({
              id: userData._id || userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name
            });
          } else {
            throw new Error('Invalid response format from /auth/me');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data && response.data.success) {
        const { data } = response.data;
        localStorage.setItem('token', data.token);
        // Set the admin user object with the data from the response
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role
        });
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
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
      {!loading && children}
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