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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome Back
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 4 }}>
          Sign in to your account to continue
        </Typography>

        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={isSubmitting}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={isSubmitting}
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || !formik.isValid}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  color="primary"
                  sx={{ fontWeight: 'medium' }}
                >
                  Sign up
                </Link>
              </Typography>
             
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
