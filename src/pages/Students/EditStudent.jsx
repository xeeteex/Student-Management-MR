import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Typography, Button, Container, Paper, 
  TextField, Grid, CircularProgress 
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { studentAPI } from '../../services/api';
import { useSnackbar } from 'notistack';

const EditStudent = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState({
    name: '',
    email: '',
    course: '',
    age: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (location.state?.student) {
      setStudent(location.state.student);
      setLoading(false);
    } else if (id) {
      fetchStudent();
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentAPI.getById(id);
      
      if (!response.data) {
        throw new Error('No student data received');
      }
      
      setStudent({
        name: response.data.name || '',
        email: response.data.email || '',
        course: response.data.course || '',
        age: response.data.age?.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      setError('Failed to load student data. Please try again.');
      enqueueSnackbar('Failed to load student data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setSubmitting(true);
    
    try {
      const studentData = {
        ...student,
        age: parseInt(student.age, 10)
      };

      if (id) {
        await studentAPI.update(id, studentData);
        enqueueSnackbar('Student updated successfully', { variant: 'success' });
      } else {
        await studentAPI.create(studentData);
        enqueueSnackbar('Student created successfully', { variant: 'success' });
      }
      
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to save student. Please try again.', 
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderFormFields = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={student.name}
          onChange={handleChange}
          required
          margin="normal"
          variant="outlined"
          error={!student.name && formSubmitted}
          helperText={!student.name && formSubmitted ? 'Name is required' : ''}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={student.email}
          onChange={handleChange}
          required
          margin="normal"
          variant="outlined"
          error={(!student.email || !/\S+@\S+\.\S+/.test(student.email)) && formSubmitted}
          helperText={(!student.email || !/\S+@\S+\.\S+/.test(student.email)) && formSubmitted 
            ? 'Valid email is required' 
            : ''}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={student.age}
          onChange={handleChange}
          required
          margin="normal"
          variant="outlined"
          error={!student.age && formSubmitted}
          helperText={!student.age && formSubmitted ? 'Age is required' : ''}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Course"
          name="course"
          value={student.course}
          onChange={handleChange}
          required
          margin="normal"
          variant="outlined"
          error={!student.course && formSubmitted}
          helperText={!student.course && formSubmitted ? 'Course is required' : ''}
        />
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/students')}
        sx={{ mb: 3 }}
      >
        Back to Students
      </Button>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Student' : 'Add New Student'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          {renderFormFields()}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/students')}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditStudent;
