import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material"
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
} from "@mui/icons-material"


import { studentAPI } from "../services/api"


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
        minHeight: 160,
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

const PublicHome = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  // Fetch students data
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        const response = await studentAPI.getAll()
        return response.data?.data || []
      } catch (error) {
        console.error("Error fetching students:", error)
        return []
      }
    },
  })

  // Calculate stats from students data
  const studentsPerCourse = students.reduce((acc, student) => {
    if (student.course) {
      acc[student.course] = (acc[student.course] || 0) + 1
    }
    return acc
  }, {})

  const totalCourses = Object.keys(studentsPerCourse).length
  
  // Log the total students and courses
  console.log('Total Students:', students.length)
  console.log('Total Courses:', totalCourses)
  console.log('Students per course:', studentsPerCourse)

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          py: 8,
          px: { xs: 2, sm: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: "white",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
          }}
        >
          Welcome to Mentorly
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            maxWidth: 700,
            mx: "auto",
            mb: 4,
            opacity: 0.9,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Manage your educational institution with our student
          management system
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{
              px: 5,
              py: 1.8,
              fontSize: '1.1rem',
              borderRadius: 12,
              fontWeight: 600,
              textTransform: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              },
              '& .MuiButton-startIcon': {
                '& > *:first-of-type': {
                  fontSize: '1.5rem',
                }
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Get Started
          </Button>
         
        </Box>
      </Box>

      {/* Stats Section */}
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 4, fontWeight: 600, textAlign: "center" }}
      >
        Our Impact
      </Typography>
      <Grid container spacing={3} sx={{ mb: 8, justifyContent: 'center' }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={5} key={index}>
            <StatCard
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={isLoading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 4, fontWeight: 600, textAlign: "center" }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "Easy to Use",
              description:
                "very easy to use",
            },
            {
              title: "Comprehensive",
              description:
                "comprehensive with all components",
            },
            {
              title: "Secure & Reliable",
              description:
                "secure and reliable system",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default PublicHome
