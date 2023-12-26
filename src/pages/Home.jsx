import React from 'react';
import Sidebar from './Fixes/Sidebar'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MyComponent from '../test';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <>
    <Box sx ={{ display : "flex"}}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

        <Toolbar />
        <MyComponent />
        <Dashboard />
      </Box>
      </Box>
    </>
  )
}
