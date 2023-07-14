import React, { useEffect, useState } from 'react';
import pb from '../lib/PocketBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ArticleIcon from '@mui/icons-material/Article';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import Calendar from './Calender';
import styled from '@emotion/styled';
import {OverdueTasks, OverdueProjects ,fetchTasks , fetchProjects} from '../lib/Overdue';

const Circle = styled('div')({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    margin: '0 auto'
  });

export default function Dashboard() {
    const [taskCount, setTaskCount] = useState(0); // State for task count
    const [projectsCount,setProjectsCount] = useState(0);
    const [userRole, setUserRole] = useState('');
    const [userCurrent , setUserCurrent] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
          try {
            const role = pb.authStore.model.role;
            setUserRole(role);
    
            const userId = pb.authStore.model.id;
            setUserCurrent(userId);
          } catch (error) {
            console.log('Error fetching user role:', error);
          }
        };    
        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          if (userRole && userCurrent) {
            const projects = await fetchProjects();            
            // Update the task count
            setProjectsCount(projects.length);
          }
        };
        fetchData();
      }, [userRole, userCurrent]);
    useEffect(() => {
        const fetchData = async () => {
          if (userRole && userCurrent) {
            const tasks = await fetchTasks(userRole, userCurrent);            
            // Update the task count
            setTaskCount(tasks.length);
          }
        };
        fetchData();
      }, [userRole, userCurrent]);


    if (userRole === 'Directeur') {
    return (
        <>
        <Stack direction="row"
               justifyContent="space-around"
               alignItems="start"
               spacing={1}
       >
       <Card sx={{ minWidth: 400 }}>
         <CardContent>
         <ArticleIcon style={{float: 'right'}} />
           <Typography gutterBottom variant="h5" component="div">
           Projets
           </Typography>
           <Divider />
           <Typography variant="body2" color="text.secondary" mt={2}>
           Le nombre des Projets :
           </Typography>
           <br></br>
           <Circle>
           <Typography variant="h3">{projectsCount}</Typography>
         </Circle>
         </CardContent>
       </Card>
       <Card sx={{ minWidth: 400 }}>
         <CardContent>
           <RunningWithErrorsIcon style={{float: 'right'}} />
         <h2>Projets en retard</h2>
         <Divider />
           <OverdueProjects />
         </CardContent>
       </Card>
       <Card sx={{ maxWidth: 345 }}>
         <CardContent>
           <Calendar />
         </CardContent>
       </Card>
       </Stack>
       </>
    );
    }


  return (
    <>
     <Stack direction="row"
            justifyContent="space-around"
            alignItems="start"
            spacing={1}
    >
    <Card sx={{ minWidth: 400 }}>
      <CardContent>
      <ArticleIcon style={{float: 'right'}} />
        <Typography gutterBottom variant="h5" component="div">
        tâches
        </Typography>
        <Divider />
        <Typography variant="body2" color="text.secondary" mt={2}>
        Le nombre des tâches que vous avez :
        </Typography>
        <br></br>
        <Circle>
        <Typography variant="h3">{taskCount}</Typography>
      </Circle>
      </CardContent>
    </Card>
    <Card sx={{ minWidth: 400 }}>
      <CardContent>
        <RunningWithErrorsIcon style={{float: 'right'}} />
      <h2>Tâche en retard</h2>
      <Divider />
        <OverdueTasks />
      </CardContent>
    </Card>
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Calendar />
      </CardContent>
    </Card>
    </Stack>
    </>   
  );
}
