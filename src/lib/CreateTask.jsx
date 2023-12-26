import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import pb from './PocketBase';

export default function CreateTask({ columnId , projectId , setIsTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorite, setPriorite] = useState(''); 
  const [collaborateur, setCollaborateur] = useState([]);
  const [Collaborateur, setSelectedCollaborateur] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [file, setFile] = useState(null);


  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };
  

  const handleDateChange = (date) => {
    console.log(date)
    setSelectedDate(date);
  };
  const handleCollaborateurChange = (event) => {
    setSelectedCollaborateur(event.target.value);
  };


  const Priority = [
    {
      value: 'high',
      label: 'Top',
    },
    {
      value: 'medium',
      label: 'Moyen',
    },
    {
      value: 'low',
      label: 'Faible',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !priorite || !selectedDate || !Collaborateur) {
      window.alert('Veuillez remplir tous les champs requis');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priorite', priorite);
    
    // Check if a file is selected before appending
    if (file) {
      formData.append('media', file);
    }
  
    // Check if selectedDate is a valid Date object
    const validSelectedDate = new Date(selectedDate);
    if (validSelectedDate instanceof Date && !isNaN(validSelectedDate)) {
      const formattedDate = validSelectedDate.toISOString().split('T')[0]; // Extracting only the date part
      formData.append('dateDecheance', formattedDate);
    } else {
      window.alert('Veuillez sélectionner une date valide');
      return;
    }
  
  
    formData.append('collaborateurId', Collaborateur);
    formData.append('columnId', columnId);
    formData.append('ProjectId', projectId);
  
    try {
      // Use PocketBase SDK or API to create a new record with formData
      await pb.collection('Tasks').create(formData);
      console.log('Record created:', formData);
  
      // Reset form fields
      setTitle('');
      setDescription('');
      setSelectedDate(null);
      setPriorite('');
      setSelectedCollaborateur('');
      setFile(null);
  
      setIsTaskCreated(true);
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };
  

  useEffect(() => {
    const fetchCollaborateur = async () => {
      try {
        // Fetch the responsables from the API
        const CollaborateurData = await pb.collection('users').getFullList({
          filter: "role = 'Collaborateur'",
        });
        setCollaborateur(CollaborateurData);
      } catch (error) {
        console.error('Error fetching Collaborateurs:', error);
      }
    };

    fetchCollaborateur();
  }, []);

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Divider />
        <Stack  alignItems="center">
          <h2>Ajouter Votre Task</h2>
        </Stack>
        <div>
        <TextField
          id="outlined-select-currency"
          select
          label="Priorité"
          helperText="Choisi la Priorité"
          value={priorite}
          onChange={(e) => setPriorite(e.target.value)}
        >
          {Priority.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
          <TextField
            id="outlined-multiline-flexible"
            label="Titre"
            multiline
            maxRows={4}
            onChange={(e) => setTitle(e.target.value)}
          />
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="collaborateur-suivi-label">Collaborateur Suivi</InputLabel>
              <Select
                    labelId="Collaborateur-suivi-label"
                    id="Collaborateur-suivi"
                    value={Collaborateur}
                    onChange={handleCollaborateurChange}
                    label="Collaborateur Suivi"
                  >
                <MenuItem value="">
                  <em>Vide</em>
                </MenuItem>
                {collaborateur.map((collaborateur) => (
                  <MenuItem key={collaborateur.id} value={collaborateur.id}>
                    {collaborateur.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          <Stack direction="row">
            <TextField
              id="outlined-multiline-static"
              style={{width: 465}}
              label="Description"
              multiline
              rows={4}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DatePicker']}>
    <DatePicker
      label="Date De Realisation"
      value={selectedDate}
      onChange={handleDateChange}
      renderInput={(params) => <TextField {...params} />}
      inputFormat="YYYY-MM-DD" // Set the format to display in the input
      // other necessary props
    />
  </DemoContainer>
</LocalizationProvider>
              <FormControl sx={{ m: 1, width: '25ch' }}>
          <Input
            id="file-upload"
            type="file"
            sx={{ display: 'block'}}
            inputProps={{
              accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
              onChange: handleFileChange,
            }}
          />
          <FormHelperText>Select a file (.pdf, .docx, .jpg, .png)</FormHelperText>
        </FormControl>
          </Stack>
          </Stack>
        </div>
        <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="contained" type="submit">
                Enregistrer
              </Button>
            </Stack>
      </Box>
    </>
  );
}
