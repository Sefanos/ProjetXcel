import  Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import React from 'react';


export default function Footer() {
    return (
        <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          textAlign: 'center',
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Copyright © 2023, PM.
        </Typography>
      </Box>
    )
  
}
