import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTheme, alpha } from "@mui/material/styles"
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  IconButton,
  Avatar,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  CalendarMonth as CalendarIcon,
  Folder as FolderIcon,
  Help as HelpIcon,
} from "@mui/icons-material"
import { useAuth } from "../../context/AuthContext"

const drawerWidth = 260

const Sidebar = ({ open, onClose, onTransitionEnd, drawerWidth, variant = "persistent" }) => {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [expandedItems, setExpandedItems] = useState({})

  useEffect(() => {
    // Expand the parent menu item if the current path matches any submenu item
    const currentPath = location.pathname
    const newExpandedItems = { ...expandedItems }

    menuItems.forEach((item) => {
      if (item.subItems) {
        const isActive = item.subItems.some((subItem) => subItem.path === currentPath)
        if (isActive) {
          newExpandedItems[item.text] = true
        }
      }
    })

    setExpandedItems(newExpandedItems)
  }, [location.pathname])

  const handleItemClick = (item) => {
    if (item.subItems) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.text]: !prev[item.text],
      }))
    } else {
      navigate(item.path)
      if (onClose && variant === "temporary") onClose()
    }
  }

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Students",
      icon: <PeopleIcon />,
      path: "/dashboard/students",
      subItems: [
        { text: "All Students", path: "/dashboard/students" },
        { text: "Add New", path: "/dashboard/students/new" },
      ],
    },
    {
      text: "Courses",
      icon: <SchoolIcon />,
      path: "/dashboard/courses",
    },
    {
      text: "Calendar",
      icon: <CalendarIcon />,
      path: "/dashboard/calendar",
    },
    {
      text: "Documents",
      icon: <FolderIcon />,
      path: "/dashboard/documents",
    },
  ]

  const bottomMenuItems = [
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/dashboard/settings",
    },
    {
      text: "Help & Support",
      icon: <HelpIcon />,
      path: "/dashboard/help",
    },
  ]

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Drawer Header with Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          height: 64,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.2rem",
              mr: 1.5,
            }}
          >
            S
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Student MS
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ borderRadius: 1.5 }}>
          {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Main Menu Items */}
      <Box sx={{ overflowY: "auto", flex: 1, px: 1.5, py: 2 }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <Box key={item.text} sx={{ mb: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  selected={isActive(item.path) && !item.subItems}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      },
                    },
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.action.hover, 0.05),
                    },
                    py: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive(item.path) && !item.subItems ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                      color: isActive(item.path) && !item.subItems ? theme.palette.primary.main : "inherit",
                    }}
                  />
                  {item.subItems && (expandedItems[item.text] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <Collapse in={expandedItems[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate(subItem.path)
                            if (onClose && variant === "temporary") onClose()
                          }}
                          selected={isActive(subItem.path, true)}
                          sx={{
                            pl: 6,
                            py: 0.75,
                            borderRadius: 2,
                            mb: 0.5,
                            "&.Mui-selected": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                              },
                            },
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.action.hover, 0.05),
                            },
                          }}
                        >
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: "0.875rem",
                              fontWeight: isActive(subItem.path, true) ? 600 : 400,
                              color: isActive(subItem.path, true) ? theme.palette.primary.main : "inherit",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Bottom Menu Items */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <Divider sx={{ my: 2 }} />
        <List disablePadding>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.action.hover, 0.05),
                  },
                  py: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? theme.palette.primary.main : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? theme.palette.primary.main : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{
        width: { md: open ? drawerWidth : 0 },
        flexShrink: { md: 0 },
        height: "100vh",
      }}
    >
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        onTransitionEnd={onTransitionEnd}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            boxShadow: "0 0 20px rgba(0,0,0,0.05)",
            [theme.breakpoints.down("md")]: {
              width: "100%",
              maxWidth: drawerWidth,
            },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar
