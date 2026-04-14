import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
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
              p: 3,
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Something went wrong
            </Typography>

            <Typography variant="body2" color="error" sx={{ mb: 3 }}>
              {this.state.error?.message}
            </Typography>

            <Button
              variant="contained"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
