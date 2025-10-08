/**
 * Students Module: Student List Component
 * 
 * Displays a paginated and searchable list of all students in the system.
 * Provides CRUD operations through a user-friendly interface with search and filtering capabilities.
 * 
 * Dependencies:
 * - React (useState, useEffect) - For component state and side effects
 * - React Router - For navigation and routing
 * - Material-UI - For UI components and layout
 * - Notistack - For toast notifications
 * - Custom API Service - For student data operations
 */

// Core React and state management
import React, { useState, useEffect } from 'react';

// UI Components from Material-UI
import { 
  Box,                // Layout component
  Typography,          // Text display
  Button,              // Interactive buttons
  Container,           // Page container
  Paper,               // Card-like container
  Table,               // Table components
  TableBody,          
  TableCell,          
  TableContainer,     
  TableHead,          
  TableRow,
  IconButton,         // Clickable icons
  Dialog,             // Modal dialogs
  DialogTitle,        
  DialogContent,      
  DialogContentText,  
  DialogActions,      
  CircularProgress,   // Loading indicator
  Snackbar,           // Temporary notifications
  Alert,              // Alert messages
  TextField,          // Form inputs
  InputAdornment      // Input decorations
} from '@mui/material';

// Icons from Material-UI
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

// Routing
import { Link, useNavigate } from 'react-router-dom';

// API and Services
import { studentAPI } from '../../services/api';

// Notifications
import { useSnackbar } from 'notistack';

/**
 * Students Component
 * 
 * Main component for displaying and managing the list of students.
 * Handles data fetching, searching, and CRUD operations.
 * 
 * State:
 * - students: Array of all students from the API
 * - filteredStudents: Filtered list of students based on search
 * - searchTerm: Current search term for filtering
 * - loading: Boolean indicating if data is being fetched
 * - deleteDialogOpen: Controls delete confirmation dialog visibility
 * - studentToDelete: Currently selected student for deletion
 */
const Students = () => {
  // State management
  const [students, setStudents] = useState([]);             // Original student data
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered student list
  const [searchTerm, setSearchTerm] = useState('');         // Search input value
  const [loading, setLoading] = useState(true);             // Loading state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete dialog visibility
  const [studentToDelete, setStudentToDelete] = useState(null); // Student selected for deletion
  
  // Hooks
  const { enqueueSnackbar } = useSnackbar();  // For showing notifications
  const navigate = useNavigate();              // For programmatic navigation

  /**
   * Effect: Filter students based on search term
   * 
   * Updates the filteredStudents state whenever the search term or student list changes.
   * Filters students by name or course (case-insensitive).
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // If search is empty, show all students
      setFilteredStudents(students);
    } else {
      // Filter students by name or course
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(lowercasedFilter) ||
        (student.course && student.course.toLowerCase().includes(lowercasedFilter))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
  };

  /**
   * Effect: Fetch students on component mount
   */
  useEffect(() => {
    fetchStudents();
  }, []);

  /**
   * Fetches all students from the API
   * Updates both the main and filtered student lists
   */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      // The API returns { success: true, data: [...] }
      const studentsData = response.data?.data || [];
      console.log('Fetched students data:', studentsData);
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      enqueueSnackbar('Failed to fetch students', { variant: 'error' });
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the delete confirmation dialog
   * @param {Object} student - Student to be deleted
   */
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirms and executes student deletion
   * Calls the API and updates the UI accordingly
   */
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    try {
      await studentAPI.delete(studentToDelete._id);
      enqueueSnackbar('Student deleted successfully', { variant: 'success' });
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error deleting student:', error);
      enqueueSnackbar('Failed to delete student', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  /**
   * Navigates to the edit page for the selected student
   * @param {Object} student - Student to be edited
   */
  const handleEditClick = (student) => {
    navigate(`/dashboard/students/edit/${student._id}`, { state: { student } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">Students</Typography>
            <Button
              component={Link}
              to="/students/new"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Student
            </Button>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or course..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {searchTerm ? 'No matching students found' : 'No students found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student._id} hover>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.course || 'N/A'}</TableCell>
                      <TableCell>{student.age || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEditClick(student)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                          title="Edit student"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(student)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Delete Student
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Students;
