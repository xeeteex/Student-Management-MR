import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{ mt: 3 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
