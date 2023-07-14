import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import pb from '../lib/PocketBase';
import Divider from '@mui/material/Divider';

const TaskDetails = ({ task }) => {
  const [collaboratorName, setCollaboratorName] = useState('');

  const getPriorityColor = (priority) => {
    if (priority === 'high') {
      return { color: 'red', contrastText: '#fff' };
    } else if (priority === 'medium') {
      return { color: 'orange', contrastText: '#fff' };
    } else if (priority === 'low') {
      return { color: 'green', contrastText: '#fff' };
    } else {
      return { color: 'default', contrastText: '#000' };
    }
  };

  useEffect(() => {
    const fetchCollaboratorName = async () => {
      // Fetch all user records
      const usersRef = pb.collection('users');
      const records = await usersRef.getFullList();

      // Find the collaborator record with the corresponding ID
      const collaboratorRecord = records.find((record) => record.id === task.collaborateur);

      // Get the collaborator name from the record data
      const collaboratorName = collaboratorRecord ? collaboratorRecord.nom : '';

      setCollaboratorName(collaboratorName);
    };

    fetchCollaboratorName();
  }, [task.collaborateur]);

  return (
    <Box sx={{ marginTop: '20px', marginLeft: '20px' }}>
      <Typography variant="h5" align="center">Tache Détails</Typography>
      < Divider />
      <div style={{ marginTop: '20px' }}>
        <strong>Task:</strong> {task.Task}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Description:</strong> {task.Description}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Priorité:</strong> <Chip label={getPriorityLabel(task.Priority)} sx={{ backgroundColor: getPriorityColor(task.Priority).color, color: getPriorityColor(task.Priority).contrastText }} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Date de Réalisation:</strong> {new Date(task.Due_Date).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Collaborateur:</strong> {collaboratorName}
      </div>
      {/* Add more task details as needed */}
    </Box>
  );
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'Haut';
    case 'medium':
      return 'Moyen';
    case 'low':
      return 'Faible';
    default:
      return 'Inconnu';
  }
};

export default TaskDetails;
