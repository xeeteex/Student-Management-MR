/**
 * Authentication Module: Login Component
 * 
 * This module handles user authentication through a secure login form.
 * It integrates with the application's authentication context and provides
 * form validation, error handling, and user feedback.
 * 
 * Dependencies:
 * - React (useState, useEffect) - For component state and side effects
 * - React Router - For navigation and route handling
 * - Formik & Yup - For form handling and validation
 * - Material-UI - For UI components and styling
 * - Notistack - For toast notifications
 */

// Core React and state management
import { useState, useEffect } from 'react';

// Routing
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

// Form handling and validation
import { useFormik } from 'formik';
import * as Yup from 'yup';

// UI Components from Material-UI
import {
  Box,               // Layout component
  Button,             // Button component
  Container,          // Page container
  Link,               // Navigation links
  TextField,          // Form input fields
  Typography,         // Text display
  Paper,              // Card-like container
  InputAdornment,     // Input decorations
  IconButton,         // Clickable icons
  CircularProgress,   // Loading indicator
  Alert,              // Error/success messages
  Grid,               // Grid layout
} from '@mui/material';

// Icons from Material-UI
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Application context and utilities
import { useAuth } from '../../context/AuthContext';  // Authentication state
import { useSnackbar } from 'notistack';              // Toast notifications

/**
 * Login Component
 * 
 * Handles user authentication through a form that collects email and password.
 * Manages form state, validation, submission, and error handling.
 * 
 * State Management:
 * - showPassword: Toggles password visibility
 * - isSubmitting: Tracks form submission status
 * - error: Stores authentication errors
 */

const Login = () => {
  // Local state for UI and form handling
  const [showPassword, setShowPassword] = useState(false);  // Toggle password visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state
  const [error, setError] = useState('');                  // Authentication errors
  
  // Authentication context and utilities
  const { login, isAuthenticated } = useAuth();  // Auth context methods and state
  const navigate = useNavigate();                // Programmatic navigation
  const location = useLocation();                // Access current route location
  const { enqueueSnackbar } = useSnackbar();     // Toast notifications

  // Get the redirect path after successful login (defaults to home)
  const from = location.state?.from?.pathname || '/';

  /**
   * Effect: Handle authentication state changes
   * 
   * Redirects to the target page if the user is already authenticated.
   * This prevents authenticated users from accessing the login page.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  /**
   * Formik form configuration
   * 
   * Handles form state, validation, and submission using Formik and Yup.
   * Validates email format and password requirements before submission.
   */
  const formik = useFormik({
    // Initial form values
    initialValues: {
      email: '',      // User's email address
      password: '',   // User's password
    },
    
    // Form validation schema using Yup
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    /**
     * Form submission handler
     * 
     * Processes the login request when the form is submitted.
     * Handles success and error states, including API errors.
     * 
     * @param {Object} values - Form values (email, password)
     */
    onSubmit: async (values) => {
      // Reset previous errors and set loading state
      setError('');
      setIsSubmitting(true);
      
      try {
        // Attempt to log in using the authentication context
        await login(values);
        
        // Show success message and redirect
        enqueueSnackbar('Login successful!', { variant: 'success' });
        navigate(from, { replace: true });
      } catch (err) {
        // Handle login errors
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        // Reset loading state regardless of outcome
        setIsSubmitting(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                  src="/assets/illustration-login.jpg" 
                  alt="Education illustration" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>

            </Grid>

          {/* Right Side - Login Form */}
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
              

              {/* Login Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 1,
                    fontSize: '32px'
                  }}
                >
                  Login
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '16px'
                  }}
                >
                  Enter your credentials to access the platform.
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Enter your student ID"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={isSubmitting}
                  sx={{
                    mb: 3,
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
                  label="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={isSubmitting}
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
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          disabled={isSubmitting}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
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
                  disabled={isSubmitting || !formik.isValid}
                  sx={{
                    height: '56px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
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
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login'
                  )}
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
                    Don't have an account?
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create One!
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

export default Login;