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
  TextField,    // Form input fields
  Button,       // Interactive button
  Box,          // Layout component
  Typography,   // Text display
  Container,    // Page container
  Paper,        // Card-like container
  Alert,        // Error/success messages
} from '@mui/material';

/**
 * Register Component
 * 
 * Handles the registration of new admin users with form validation.
 * Manages form state, submission, and error handling.
 * 
 * State:
 * - formData: Object containing user registration fields
 * - error: String containing error messages for display
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
  
  // Error state for displaying validation/API errors
  const [error, setError] = useState('');

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
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Admin Registration
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
