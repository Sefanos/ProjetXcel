import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Bread = () => {
  const location = useLocation();

  // Check if the current location is the project page
  const isProjectPage = location.pathname === '/Projets';

  // Render the breadcrumbs conditionally
  const breadcrumbs = [
    <Typography
      key="projects"
      component={Link}
      to="/Projets"
      color="text.primary"
      underline="none"
      sx={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        textDecoration: 'none',
        '&:hover': {
          color: 'blue',
        },
      }}
      variant="p"
    >
      Projets
    </Typography>,
  ];

  // Add the "Tasks" breadcrumb if not on the project page
  if (!isProjectPage) {
    breadcrumbs.push(
      <Typography
        key="tasks"
        component={Link}
        to="#"
        color="text.primary"
        underline="none"
        sx={{
          fontWeight: 'bold',
          fontSize: '1.3rem',
          textDecoration: 'none',
          '&:hover': {
            color: 'blue',
          },
        }}
        variant="p"
      >
        Les tâche
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export default Bread;
