import { Box, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 420,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          404
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Page not found
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
        >
          Go home
        </Button>
      </Paper>
    </Box>
  )
}

export default NotFound