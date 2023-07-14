import React , {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import PrimarySearchAppBar from './Appbar';
import { useNavigate } from 'react-router-dom'; 

const drawerWidth = 200;

export default function Sidebar({onSearchQuery}) {
    const [searchQuery, setSearchQuery] = useState('');
    const Navigate = useNavigate();


    const handleSearchSubmit = (query) => {
      setSearchQuery(query);
    };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <PrimarySearchAppBar onSearchQuery={onSearchQuery} onSearchSubmit={handleSearchSubmit} />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem key ='Accueil' onClick = {()=>{Navigate("/")}} >
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Accueil" />
                </ListItemButton>
              </ListItem>
              <ListItem key ='Projets' onClick = {()=>{Navigate("/Projets")}} >
                <ListItemButton>
                  <ListItemIcon>
                    <FileOpenIcon />
                  </ListItemIcon>
                  <ListItemText primary="Projets" />
                </ListItemButton>
              </ListItem>
              <ListItem key ='Membres' onClick = {()=>{Navigate("/Members")}} >
                <ListItemButton>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Membres" />
                </ListItemButton>
              </ListItem>
              </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}