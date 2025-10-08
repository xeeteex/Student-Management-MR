import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme, alpha } from "@mui/material/styles"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Badge,
  InputBase,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material"
import { useAuth } from "../../context/AuthContext"

const Navbar = ({ onMenuClick, darkMode, toggleDarkMode }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRegisterClick = () => {
    handleMenuClose();
    navigate('/register');
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
    navigate("/")
  }

  const handleProfile = () => {
    handleMenuClose()
    navigate("/profile")
  }

  const handleSettings = () => {
    handleMenuClose()
    navigate("/settings")
  }

  const open = Boolean(anchorEl)
  const notificationsOpen = Boolean(notificationsAnchorEl)

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: "100%",
        left: 0,
        right: 0,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(theme.direction === "ltr" && {
          width: { md: "100%" },
        }),
        boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
        backdropFilter: "blur(8px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            borderRadius: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          onClick={() => navigate('/dashboard')}
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 1,
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                mr: 1,
              }}
            >
              M
            </Box>
            <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
              Mentorly
            </Box>
          </Typography>
        </Box>

      

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
                  
          {/* User Profile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: 2,
              p: 0.5,
              pl: 1,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              alt={user?.name || "User"}
              src={user?.avatar}
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {(user?.name || "U").charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: "none", md: "block" } }}>
              <Typography variant="subtitle2" noWrap fontWeight={600}>
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role || "Admin"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || "user@example.com"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            navigate('/register');
          }} 
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          Register New Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Navbar
