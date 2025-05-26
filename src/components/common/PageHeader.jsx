import { Box, Typography, Button, Breadcrumbs, Link, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledBreadcrumb = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
}));

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions = [],
  noDivider = false 
}) => {
  return (
    <Box mb={4}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <StyledBreadcrumb
            component={RouterLink}
            to="/dashboard"
            underline="none"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Home
          </StyledBreadcrumb>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography
                key={index}
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.label}
              </Typography>
            ) : (
              <StyledBreadcrumb
                key={index}
                component={RouterLink}
                to={item.to}
                underline="none"
              >
                {item.label}
              </StyledBreadcrumb>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems={subtitle ? 'flex-start' : 'center'}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom={!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions.length > 0 && (
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                startIcon={action.icon}
                onClick={action.onClick}
                component={action.to ? RouterLink : 'button'}
                to={action.to}
                disabled={action.disabled}
                size={action.size || 'medium'}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
      
      {!noDivider && <Divider sx={{ mt: 2, mb: 3 }} />}
    </Box>
  );
};

export default PageHeader;
