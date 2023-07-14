import React from 'react';
import Sidebar from './Fixes/Sidebar'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MemberList from '../components/MemberList';


export default function Members() {
  return (
    <>
    <Box sx ={{ display : "flex"}}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
      
        <MemberList />
        
      </Box>
      </Box>
    </>
  )
}
