/**
 * Authentication Module: Registration Component
 * 
 * Handles new user registration with form validation and submission.
 * Integrates with the authentication API to create new admin accounts.
 * 
 * Dependencies:
 * - React (useState) - For component state management
 * - React Router - For navigation and routing
 * - React Query (useMutation) - For handling API mutations
 * - Material-UI - For UI components and styling
 * - Custom API Service - For authentication requests
 */

// Core React and state management
import { useState } from 'react';

// Routing
import { useNavigate, Link } from 'react-router-dom';

// Data fetching and mutations
import { useMutation } from '@tanstack/react-query';

// API Services
import { authAPI } from '../../services/api';

// UI Components from Material-UI
import {
  TextField,         // Form input fields
  Button,            // Interactive button
  Box,               // Layout component
  Typography,        // Text display
  Container,         // Page container
  Paper,             // Card-like container
  Alert,             // Error/success messages
  Grid,              // Grid layout
  InputAdornment,    // Input decorations
  IconButton,        // Clickable icons
} from '@mui/material';

// Icons from Material-UI  
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Register Component
 * 
 * Handles the registration of new admin users with form validation.
 * Manages form state, submission, and error handling.
 * 
 * State:
 * - formData: Object containing user registration fields
 * - error: String containing error messages for display
 * - showPassword: Boolean for password visibility toggle
 * - showConfirmPassword: Boolean for confirm password visibility toggle
 */
const Register = () => {
  // Navigation hook for redirecting after registration
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState({
    name: '',              // User's full name
    email: '',             // User's email address
    password: '',          // User's password
    confirmPassword: '',   // Password confirmation
    role: 'admin'          // Default role is admin
  });
  
  // UI state management
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Registration Mutation
   * 
   * Handles the API call for user registration using React Query's useMutation.
   * Manages success and error states, including automatic redirection on success.
   */
  const registerMutation = useMutation({
    // Function to call the registration API
    mutationFn: (userData) => authAPI.register(userData),
    
    // Handle successful registration
    onSuccess: (data) => {
      // Redirect to login with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in.' 
        } 
      });
    },
    
    // Handle registration errors
    onError: (error) => {
      // Display error message from API or default message
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  });

  /**
   * Form Submission Handler
   * 
   * Validates form data and triggers the registration mutation.
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors

    // Client-side validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Prepare data for API (remove confirmPassword field)
    const { confirmPassword, ...userData } = formData;
    
    // Trigger the registration mutation
    registerMutation.mutate(userData);
  };

  /**
   * Input Change Handler
   * 
   * Updates form state when input values change.
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Dynamically update the changed field
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={0} sx={{ minHeight: '80vh' }}>
          {/* Left Side - Illustration Section */}
          <Grid 
            item 
            xs={12} 
            md={7} 
            sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
              p: 4,
            }}
          >
            {/* Mentorly Branding */}
            <Box sx={{ position: 'absolute', top: 40, left: 40 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  color: '#2563eb',
                  fontSize: '28px'
                }}
              >
                Mentorly
              </Typography>
            </Box>

            {/* Main Illustration */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <img 
                src="/assets/illustration-register.jpg" 
                alt="Registration illustration" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  // Fallback to login illustration if register image doesn't exist
                  e.target.src = '/assets/illustration-login.jpg';
                }}
              />
            </Box>
          </Grid>

          {/* Right Side - Registration Form */}
          <Grid 
            item 
            xs={12} 
            md={5}
            sx={{
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: { xs: '0 0 16px 16px', md: '0 16px 16px 0' },
              p: 4,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: '520px' }}>
              {/* Register Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 1,
                    fontSize: '24px'
                  }}
                >
                  Create Account
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '14px'
                  }}
                >
                  Join our platform to get started.
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}

              {/* Registration Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      height: '56px',
                      backgroundColor: '#f8fafc',
                      border: 'none',
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover fieldset': {
                        border: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #2563eb',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#2563eb',
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      height: '56px',
                      backgroundColor: '#f8fafc',
                      border: 'none',
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover fieldset': {
                        border: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #2563eb',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#2563eb',
                      },
                    },
                  }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      height: '56px',
                      backgroundColor: '#f8fafc',
                      border: 'none',
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover fieldset': {
                        border: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #2563eb',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#2563eb',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      height: '56px',
                      backgroundColor: '#f8fafc',
                      border: 'none',
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover fieldset': {
                        border: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #2563eb',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#2563eb',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleToggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={registerMutation.isPending}
                  sx={{
                    height: '56px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 500,
                    background: '#2563eb',
                    mb: 4,
                    '&:hover': {
                      background: '#1d4ed8',
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#94a3b8',
                    },
                  }}
                >
                  {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>

                {/* Footer Text */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      mb: 1
                    }}
                  >
                    Already have an account?
                  </Typography>
                  <Link
                    to="/login"
                    style={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2563eb',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign In
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;