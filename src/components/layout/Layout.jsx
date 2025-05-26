import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 260;

const Layout = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setDrawerOpen(!drawerOpen)
    }
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerClose = () => {
    if (isMobile) {
      setIsClosing(true)
    }
    setDrawerOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />

      {/* App Bar */}
      <Navbar onMenuClick={handleDrawerToggle} />

      {/* Sidebar */}
      <Sidebar
        open={drawerOpen}
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
        drawerWidth={DRAWER_WIDTH}
        variant={isMobile ? 'temporary' : 'persistent'}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: '64px',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            width: '100%',
            py: 3,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}

export default Layout
