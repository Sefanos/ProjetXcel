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
import pb from './PocketBase';

export default function CreateTask({ columnId , projectId , setIsTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorite, setPriorite] = useState(''); 
  const [collaborateur, setCollaborateur] = useState([]);
  const [Collaborateur, setSelectedCollaborateur] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  


  const handleDateChange = (date) => {
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
  
    // Create a new record in PocketBase
    const data = {
      title : title,
      description :description ,
      priorite : priorite,
      dateDecheance: selectedDate ? selectedDate.toDate() : null,
      collaborateurId : Collaborateur,
      columnId :columnId ,
      ProjectId :projectId ,
    };

    try {
      await pb.collection('Tasks').create(data);
      console.log('Record created:', data);
      
 // Call the onTaskCreated callback
     
      // Reset form fields
      setTitle('');
      setDescription('');
      setSelectedDate(null);
      setPriorite('');
      setSelectedCollaborateur('');

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
                  />
                </DemoContainer>
              </LocalizationProvider>
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
