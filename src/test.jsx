import React, { useEffect, useState } from 'react';
import pb from './lib/PocketBase';


const MyComponent = () => {
  const [userRole, setUserRole] = useState('');
  const [userCurrent , setUserCurrent] = useState('');
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    // Function to fetch user's role from your authentication system
    const fetchUserRole = async () => {
      try {
        // Retrieve the user's role from your authentication system
        const role = pb.authStore.model.role; // Replace this with your actual logic to fetch the user's role
        setUserRole(role);

        const userId = pb.authStore.model.id; // Replace this with your actual logic to fetch the user's id
        setUserCurrent(userId);
      } catch (error) {
        console.log('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);


  useEffect(() => {
    
    // Function to fetch tasks based on the user's role using PocketBase
    const fetchTasks = async () => {
      try {
        if (userRole === 'Directeur') {
          // Fetch all tasks for "Directeur" user
          const tasksCollection = pb.collection('tasks');
          await tasksCollection.getFullList().then((res)=>setTasks(res));
          
        } else if (userRole === 'Collaborateur') {
          // Fetch tasks related to the specific collaborateur
          const tasksCollection = pb.collection('tasks');
          await tasksCollection.getFullList({
            filter: `collaborateurId ?=  "${userCurrent}"`, // Replace 'current_user_id' with actual collaborateur identifier
          }).then((res)=>(setTasks(res)));
          
        }
      } catch (error) {
        console.log('Error fetching tasks:', error);
      }
    };

    if (userRole && userCurrent) {
        fetchTasks();
      }
    }, [userRole, userCurrent]);

  return (
    <div>      
      <h1>Bienvenus, {userRole} {pb.authStore.model.nom}!</h1>
      {/* <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          p: 5,
        },
      }}
    >
        <Paper square  elevation={7}>
        <h2>vos tâches :</h2>
        <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
        </Paper>
        </Box> */}
    </div>
  );
};

export default MyComponent;
