import React from 'react';
import Sidebar from './Fixes/Sidebar'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Bread from '../components/Bread';
import Kanban from '../components/Kanban';



export default function Tasks() {


  return (
    <>
    <Box sx ={{ display : "flex"}}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Bread />
        <Kanban />
      </Box>
      </Box>
    </>
  )
}
