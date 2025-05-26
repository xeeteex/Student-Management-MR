import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Typography, Button, Container, Paper, TextField, CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { studentAPI } from '../../services/api';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Full name is required')
    .max(100, 'Name is too long'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  course: Yup.string()
    .required('Course is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number')
    .max(120, 'Age must be less than 120')
});

const AddStudent = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      course: '',
      age: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setFormSubmitted(true);
      
      if (!formik.isValid) return;
      
      try {
        setIsSubmitting(true);
        
        const studentData = {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          age: parseInt(values.age, 10),
          course: values.course.trim()
        };
        
        console.log('Submitting student data:', studentData);
        await studentAPI.create(studentData);
        
        enqueueSnackbar('Student added successfully!', { variant: 'success' });
        navigate('/students');
      } catch (error) {
        console.error('Error adding student:', error);
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message || 
                            'Failed to add student. Please try again.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  const renderFormFields = () => (
    <>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            required
            margin="none"
            variant="outlined"
            error={!formik.values.name && formSubmitted}
            helperText={!formik.values.name && formSubmitted ? 'Name is required' : ''}
            size="small"
          />
        </Box>
        
        <Box sx={{ flex: 4 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            required
            margin="none"
            variant="outlined"
            error={(!formik.values.email || !/\S+@\S+\.\S+/.test(formik.values.email)) && formSubmitted}
            helperText={(!formik.values.email || !/\S+@\S+\.\S+/.test(formik.values.email)) && formSubmitted 
              ? 'Valid email is required' 
              : ''}
            size="small"
          />
        </Box>
        
        <Box sx={{ flex: 3 }}>
          <TextField
            fullWidth
            label="Course"
            name="course"
            value={formik.values.course}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            required
            margin="none"
            variant="outlined"
            error={!formik.values.course && formSubmitted}
            helperText={!formik.values.course && formSubmitted ? 'Course is required' : ''}
            size="small"
          />
        </Box>
        
        <Box sx={{ flex: 2 }}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formik.values.age}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            required
            margin="none"
            variant="outlined"
            error={!formik.values.age && formSubmitted}
            helperText={!formik.values.age && formSubmitted ? 'Age is required' : ''}
            size="small"
            inputProps={{ min: 1, max: 120 }}
          />
        </Box>
      </Box>
    </>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/students')}
          sx={{ mb: 3 }}
        >
          Back to Students
        </Button>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Add New Student
          </Typography>
          
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
            {renderFormFields()}
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/students')}
                sx={{ mr: 2 }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Adding...' : 'Add Student'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddStudent;
