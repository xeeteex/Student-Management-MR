import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  useTheme,
  useMediaQuery,
  Avatar,
  alpha,
} from "@mui/material"
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers"

// Custom components
import PageHeader from "../components/common/PageHeader"

// API services
import { studentAPI } from "../services/api"

// StatCard - Displays a single statistic with icon and loading state
const StatCard = ({ title, value, icon: Icon, color, loading = false }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 140,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              mr: 2,
              p: 1.5,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette[color].main, 0.15),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: theme.palette[color].main, fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                {value}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

const Dashboard = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  // Fetch students data
  const { data: studentsData, isLoading: isLoadingStudents, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        const response = await studentAPI.getAll()
        // The API returns { success: true, data: [...] }
        return response.data?.data || []
      } catch (error) {
        console.error("Error fetching students:", error)
        return []
      }
    },
  })

  // Ensure students is always an array
  const students = Array.isArray(studentsData) ? studentsData : [];
  
  const studentsPerCourse = students.reduce((acc, student) => {
    if (student?.course) {
      acc[student.course] = (acc[student.course] || 0) + 1
    }
    return acc
  }, {})

  const sortedCourses = Object.entries(studentsPerCourse)
    .sort((a, b) => b[1] - a[1])
    .map(([course, count]) => ({ course, count }))

  const totalCourses = sortedCourses.length

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: PeopleIcon,
      color: "primary",
    },
    {
      label: "Total Courses",
      value: totalCourses,
      icon: SchoolIcon,
      color: "secondary",
    },
  ]

  const handleViewAllStudents = () => navigate("/dashboard/students")
  const handleAddStudent = () => navigate("/dashboard/students/new")

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8f9fa",
      }}
    >
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your student management system."
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={[
          {
            label: "View All Students",
            variant: "outlined",
            color: "primary",
            onClick: handleViewAllStudents,
            icon: <ArrowForwardIcon />,
          },
          {
            label: "Add Student",
            variant: "contained",
            color: "primary",
            onClick: handleAddStudent,
            icon: <AddIcon />,
            to: "/dashboard/students/new",
          },
        ]}
      />

      {/* Stats Cards + Calendar */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title={stats[0].label}
            value={stats[0].value}
            icon={stats[0].icon}
            color={stats[0].color}
            loading={isLoadingStudents}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={stats[1].label}
            value={stats[1].value}
            icon={stats[1].icon}
            color={stats[1].color}
            loading={isLoadingStudents}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 140,
            }}
          >
            <CardContent sx={{ p: 0, height: "100%", "&:last-child": { pb: 0 } }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  sx={{
                    width: "100%",
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              </LocalizationProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Students per Course Table */}
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ p: 3, pb: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
              <Box display="flex" alignItems="center" mb={1}>
                <MenuBookIcon color="primary" sx={{ mr: 1.5 }} />
                <Typography variant="h6" fontWeight={600}>
                  Students per Course
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", px: 0, pb: 0 }}>
              {isLoadingStudents ? (
                <Box p={3}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="text" width="100%" height={50} sx={{ my: 1 }} />
                  ))}
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Course Name</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>
                          Number of Students
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedCourses.length > 0 ? (
                        sortedCourses.map(({ course, count }) => (
                          <TableRow
                            key={course}
                            hover
                            sx={{
                              transition: "background-color 0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>{course || "No Course Assigned"}</TableCell>
                            <TableCell align="right" sx={{ py: 2.5 }}>
                              <Box display="flex" alignItems="center" justifyContent="flex-end">
                                <PeopleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                <Typography fontWeight={500}>{count}</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                            <Box display="flex" flexDirection="column" alignItems="center" p={4}>
                              <MenuBookIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                              <Typography color="text.secondary" fontWeight={500}>
                                No course data available
                              </Typography>
                              <Typography color="text.disabled">
                                Add students with course information to see statistics
                              </Typography>
                            </Box>
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
  )
}

export default Dashboard
