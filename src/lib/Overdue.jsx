import React, { useEffect, useState } from 'react';
import pb from './PocketBase';

export const fetchTasks = async (userRole, userCurrent) => {
  try {
    if (userRole === 'Directeur') {
      // Fetch all tasks for "Directeur" user
      const tasksCollection = pb.collection('tasks');
      const res = await tasksCollection.getFullList();
      return res;
    } else if (userRole === 'Collaborateur') {
      // Fetch tasks related to the specific collaborateur
      const tasksCollection = pb.collection('tasks');
      const res = await tasksCollection.getFullList({
        filter: `collaborateurId ?=  "${userCurrent}"`,
      });
      return res;

    }
    return [];
  } catch (error) {
    console.log('Error fetching tasks:', error);
    return [];
  }
};

export const fetchProjects = async () => {
  try {
      const projects =  await pb.collection('Projects').getFullList();
      return projects;
  }catch (error){
    console.log('Error fetching :', error);
    return [];
  }
  };



  export function OverdueTasks() {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userCurrent , setUserCurrent] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const tasks = await fetchTasks(userRole, userCurrent);
        setTasks(tasks);
        setIsLoading(false); // Mark the data loading as complete
      }
    };

    fetchData();
  }, [userRole, userCurrent]);

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      const currentDate = new Date();

      const overdueTasks = tasks.filter(task => {
        const dueDate = new Date(task.dateDecheance);
        return dueDate < currentDate;
      });

      setOverdueTasks(overdueTasks);
      setIsLoading(false); // Mark the data loading as complete
    };

    if (tasks.length > 0) {
      fetchOverdueTasks();
    }

  }, [tasks]);
             

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  }

return (
    <div>
      
      {overdueTasks.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {overdueTasks.map(task => (
            <li
              key={task.id}
              style={{
                marginBottom: '8px',
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: '#f8f8f8',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}
            >
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <p style={{ margin: '8px 0', color: '#888' }}>Date de realisation: {new Date(task.dateDecheance).toLocaleDateString()}</p>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                }}
              ></span>
            </li>
          ))}
        </ul>
      ) : (
        <div>Aucune tâche en retard</div>
      )}
      {/* Other dashboard content */}
    </div>
  );
};

  export function OverdueProjects(){
    const [overdueProjects, setOverdueProjects] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [userCurrent , setUserCurrent] = useState('');
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
          setProjects(projects);
          setIsLoading(false); // Mark the data loading as complete
        }
      };
    
      fetchData();
    }, [userRole, userCurrent]);

    useEffect(() => {
      const fetchOverdueProjects = async () => {
        const currentDate = new Date();

        const overdueTasks = projects.filter(projet => {
          const dueDate = new Date(projet.dateDecheance);
          return dueDate < currentDate;
        });

        setOverdueProjects(overdueTasks);
        setIsLoading(false); // Mark the data loading as complete
      };

      if (projects.length > 0) {
        fetchOverdueProjects();
      }

    }, [projects]);
              

    if (isLoading) {
      return <div>Loading...</div>; // Display a loading indicator while data is being fetched
    }

  return (
      <div>
        
        {overdueProjects.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {overdueProjects.map(projet=> (
              <li
                key={projet.id}
                style={{
                  marginBottom: '8px',
                  padding: '12px',
                  borderRadius: '4px',
                  backgroundColor: '#f8f8f8',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}
              >
                <h3 style={{ margin: 0 }}>{projet.titre}</h3>
                <p style={{ margin: '8px 0', color: '#888' }}>Date de realisation: {new Date(projet.dateDecheance).toLocaleDateString()}</p>
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                  }}
                ></span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Aucune projet en retard</div>
        )}
        {/* Other dashboard content */}
      </div>
    );
};



