import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { logUserActivity } from './LogActivity';
import pb from './PocketBase';

export default function EditProjet({taskData , handleClose}) {
  
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priorite, setPriorite] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [responsables, setResponsables] = useState([]);
  const [Responsable, setSelectedResponsable] = useState('');

  useEffect(() => {
    if (taskData) {
      setTitre(taskData.Nom || '');
      setDescription(taskData.Description || '');
      setStatus(taskData.Progress || '');
      setPriorite(taskData.Priority || '');
    }
  }, [taskData]);

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent propagation to parent elements
  };

  const handleOutsideClick = (e) => {
    e.preventDefault(); // Prevent default action (e.g., redirection)
    handleClose(); // Close the modal or perform necessary action
  };

  const handleStatusChange = (e) => {
    const inputValue = e.target.value;

    // Check if the input is a number between 0 and 100
    if (/^\d*$/.test(inputValue) && Number(inputValue) >= 0 && Number(inputValue) <= 100) {
      setStatus(inputValue);
    }
  };

  const handleResponsableChange = (event) => {
    setSelectedResponsable(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

    // Updated data for the project
    const updatedData = {
      titre,
      description,
      priorite,
      status,
      dateDecheance: selectedDate ? selectedDate.toDate() : null,
      Responsable,
    };
    console.log(taskData.id);
    try {
      // Use the update method instead of create to update the project
      await pb.collection('Projects').update(taskData.id , updatedData);
      console.log('Record updated:', updatedData);
      console.log('Update Project' , taskData.id);
      logUserActivity(pb.authStore.model.id , 'Update Project' , taskData.id);

    // Reload the page
    // window.location.reload();

      // Perform any other necessary actions upon successful update
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        // Fetch the responsables from the API
        const responsablesData = await pb.collection('users').getFullList({
          filter: "role = 'Directeur' || role ='ChefDeProjet' ",
        });
        setResponsables(responsablesData);
      } catch (error) {
        console.error('Error fetching responsables:', error);
      }
    };

    fetchResponsables();
  }, []);

  return (
    <div onClick={handleOutsideClick}>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        onClick={handleModalClick}
      >
        <Divider />
        <Stack alignItems="center">
          <h2>Ajouter Votre Projet</h2>
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
            label="titre"
            multiline
            maxRows={4}
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
          <TextField
            id="outlined-textarea"
            label="Status"
            value={status}
            onChange={handleStatusChange}
            type="number"
            inputProps={{ min: 0, max: 100 }}
          />
          <Stack direction="row">
            <TextField
              id="outlined-multiline-static"
              style={{ width: 465 }}
              label="Description"
              multiline
              rows={4}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="responsable-suivi-label">Responsable Suivi</InputLabel>
              <Select
                labelId="responsable-suivi-label"
                id="responsable-suivi"
                value={Responsable}
                onChange={handleResponsableChange}
                label="Responsable Suivi"
              >
                <MenuItem value="">
                  <em>Vide</em>
                </MenuItem>
                {responsables.map((responsable) => (
                  <MenuItem key={responsable.id} value={responsable.id}>
                    {responsable.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Date De Realisation" value={selectedDate} onChange={handleDateChange} />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
        </div>
        <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="contained"  type="submit">
                Enregistrer
        </Button>
        </Stack>
  
      </Box>
    </div>
  );
}
