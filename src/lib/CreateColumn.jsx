import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
  maxWidth: '400px',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
});

const CreateColumn = ({ addNewColumn, projectId }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Perform the desired action with the form data
    const data = {
      title: title, // Use the title from the component state
      ProjectId: projectId, // Use the projectId from the URL
    };
  
    addNewColumn(data.title); // Call the addNewColumn function passed as a prop with the new column title
  
    // Reset the form fields
    setTitle('');
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Créer une nouvelle colonne
      </Typography>
      <TextField
        label="colonne"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary">
        Créer la colonne
      </Button>
    </StyledForm>
  );
};

export default CreateColumn;
