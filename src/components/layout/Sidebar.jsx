import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
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
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Students',
    icon: <PeopleIcon />,
    path: '/students',
    subItems: [
      { text: 'All Students', path: '/students' },
      { text: 'Add New', path: '/students/new' },
    ],
  },
  {
    text: 'Courses',
    icon: <SchoolIcon />,
    path: '/courses',
  },
  {
    text: 'Reports',
    icon: <AssessmentIcon />,
    path: '/reports',
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

const Sidebar = ({ open, onClose, onTransitionEnd, drawerWidth, variant = 'persistent' }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    // Expand the parent menu item if the current path matches any submenu item
    const currentPath = location.pathname;
    const newExpandedItems = { ...expandedItems };

    menuItems.forEach((item) => {
      if (item.subItems) {
        const isActive = item.subItems.some(
          (subItem) => subItem.path === currentPath
        );
        if (isActive) {
          newExpandedItems[item.text] = true;
        }
      }
    });

    setExpandedItems(newExpandedItems);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    if (item.subItems) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.text]: !prev[item.text],
      }));
    } else {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
            Student MS
          </Typography>
          <IconButton onClick={onClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      </DrawerHeader>
      <Divider />
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <div key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  selected={isActive(item.path) && !item.subItems}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: alpha(
                        theme.palette.primary.main,
                        0.1
                      ),
                      borderRight: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.15
                        ),
                      },
                    },
                    '&:hover': {
                      backgroundColor: alpha(
                        theme.palette.action.hover,
                        0.05
                      ),
                    },
                    py: 1.5,
                    px: 3,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive(item.path) && !item.subItems
                        ? theme.palette.primary.main
                        : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                  {item.subItems &&
                    (expandedItems[item.text] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <Collapse
                  in={expandedItems[item.text]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate(subItem.path);
                            if (onClose) onClose();
                          }}
                          selected={isActive(subItem.path, true)}
                          sx={{
                            pl: 8,
                            py: 1.25,
                            '&.Mui-selected': {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              '&:hover': {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.15
                                ),
                              },
                            },
                            '&:hover': {
                              backgroundColor: alpha(
                                theme.palette.action.hover,
                                0.05
                              ),
                            },
                          }}
                        >
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              fontWeight: isActive(subItem.path, true) ? 600 : 400,
                              color: isActive(subItem.path, true)
                                ? theme.palette.primary.main
                                : 'inherit',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: open ? drawerWidth : 0 },
        flexShrink: { md: 0 },
        height: '100vh',
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: theme.shadows[8],
            [theme.breakpoints.down('md')]: {
              width: '100%',
              maxWidth: drawerWidth,
            },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;