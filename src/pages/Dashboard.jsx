import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Grid, Card, CardContent, Typography, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, useTheme, Skeleton, alpha
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

// Custom components
import PageHeader from '../components/common/PageHeader';

// API services
import { studentAPI } from '../services/api'; // API client for student data

// StatCard - Displays a single statistic with icon and loading state
const StatCard = ({ title, value, icon: Icon, color, loading = false }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 2, 
      boxShadow: 2, 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 140
    }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box display="flex" alignItems="center">
          <Box sx={{ 
            mr: 2,
            p: 1.5,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette[color].main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon 
              sx={{ 
                color: theme.palette[color].main,
                fontSize: 28,
              }} 
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={32} />
            ) : (
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {value}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};



const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Fetch students data
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],  // Unique key for caching
    queryFn: async () => {
      try {
        const response = await studentAPI.getAll();
        return response.data || [];
      } catch (error) {
        console.error('Error fetching students:', error);
        return [];
      }
    },
  });

  // Process student data to calculate statistics
  const studentsPerCourse = students.reduce((acc, student) => {
    if (student.course) {
      acc[student.course] = (acc[student.course] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to array and sort by student count
  const sortedCourses = Object.entries(studentsPerCourse)
    .sort((a, b) => b[1] - a[1])  // Sort by count in descending order
    .map(([course, count]) => ({ course, count }));

  const totalCourses = sortedCourses.length;

  // Stats configuration for the top cards
  const stats = [
    { 
      label: 'Total Students', 
      value: students.length, 
      icon: PeopleIcon, 
      color: 'primary' 
    },
    { 
      label: 'Total Courses', 
      value: totalCourses, 
      icon: SchoolIcon, 
      color: 'secondary' 
    },
  ];

  // Navigate to students list
  const handleViewAllStudents = () => {
    navigate('/students');
  };

  return (
    <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header Section */}
      <Box sx={{ p: 3, pb: 0 }}>
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here's an overview of your student management system."
          actions={[
            {
              label: 'View All Students',
              variant: 'outlined',
              color: 'primary',
              onClick: handleViewAllStudents,
            },
          ]}
        />
      </Box>

      {/* Main Content Area - Takes remaining vertical space */}
      <Box sx={{ 
        flex: 1,                     
        p: 3,                        
        display: 'flex',             
        flexDirection: 'column',     
        height: 'calc(100vh - 180px)', 
        width: '100%',
        maxWidth: '100%',
        mx: 'auto'                   
      }}>
        {/* Stats Cards Section - Responsive grid of statistics */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Grid container spacing={3} sx={{ m: 0, width: '100%' }}>
            {stats.map((stat, index) => (
              <Grid 
                item 
                xs={12}  
                sm={6}   
                md={3}   
                key={index}
              >
                <StatCard
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  loading={isLoadingStudents}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Students per Course Section - Table in a card */}
        <Box sx={{ 
          flex: 1,                    
          width: '100%', 
          height: '100%', 
          overflow: 'hidden'          
        }}>
          {/* Main card container */}
          <Card sx={{ 
            borderRadius: 2,          
            boxShadow: 2,             
            height: '100%',           
            display: 'flex',          
            flexDirection: 'column',  
            width: '100%',            
            m: 0                      
          }}>
            {/* Card content with padding and flex layout */}
            <CardContent sx={{ 
              p: 0,                    
              display: 'flex',         
              flexDirection: 'column'   
            }}>
              {/* Header section with title */}
              <Box sx={{ p: 3, pb: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <MenuBookIcon color="primary" sx={{ mr: 1 }} /> 
                  <Typography variant="h6" fontWeight={600}>
                    Students per Course 
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} /> 
              </Box>
              
              {/* Scrollable content area */}
              <Box sx={{ 
                flex: 1,                     
                overflow: 'auto',          
                px: 3,                     
                pb: 3                      
              }}>
                {isLoadingStudents ? (
                  // Loading state with skeleton placeholders
                  <Box>
                    {[1, 2, 3].map((item) => (
                      <Skeleton 
                        key={item} 
                        variant="text" 
                        width="100%" 
                        height={40} 
                      />
                    ))}
                  </Box>
                ) : (
                  // Table with course statistics
                  <TableContainer 
                    component={Paper} 
                    elevation={0}  
                    sx={{ height: '100%' }}  
                  >
                    <Table>
                      {/* Table header */}
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Course Name</strong></TableCell>
                          <TableCell align="right"><strong>Number of Students</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      
                      {/* Table body */}
                      <TableBody>
                        {sortedCourses.length > 0 ? (
                          // Map through courses to create table rows
                          sortedCourses.map(({ course, count }) => (
                            <TableRow 
                              key={course} 
                              hover  // Highlight on hover
                            >
                              <TableCell>
                                {course || 'No Course Assigned'}
                              </TableCell>
                              <TableCell align="right">
                                <Box 
                                  display="flex" 
                                  alignItems="center" 
                                  justifyContent="flex-end"
                                >
                                  <PeopleIcon 
                                    fontSize="small" 
                                    sx={{ 
                                      mr: 1, 
                                      color: 'text.secondary' 
                                    }} 
                                  />
                                  {count} 
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          // Empty state when no courses are available
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              <Typography color="textSecondary">
                                No course data available. Add students with course information to see statistics.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
