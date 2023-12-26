import React, { useEffect, useState } from 'react';
import pb from '../lib/PocketBase';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [memberTasks , setMembertasks] = useState(null);

  const handleNomChange = (event) => {
    setNom(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleRegistration = async () => {
    
    try {

      setLoading(true);
      setRegistrationSuccess(false);

      const data = {
        nom: nom,
        email: email,
        password: password,
        passwordConfirm : password,
        role: role,
      };
  
      // Create the user with the provided data
      const record = await pb.collection('users').create(data);
      console.log('User registered successfully:', record);
  
      // Clear the form fields after successful registration
      setNom('');
      setEmail('');
      setPassword('');
      setRole('');

      setRegistrationSuccess(true);

          const updatedMembers = await pb.collection('users').getFullList();
    setMembers(updatedMembers);
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await pb.collection('users').getFullList();
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

useEffect(() => {
  const fetchTasksMembers = async () => {
    try {
      const TasksMembers = await pb.collection('Tasks').getFullList();
      setMembertasks(TasksMembers);
      console.log(TasksMembers);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  fetchTasksMembers();
}, []);


  return (
    <>
      <Box display="flex" direction="row" gap={20}>
        <div style={{ width: '600px' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Liste des membres
          </Typography>
          <List>
      {members.map((member, index) => (
        <React.Fragment key={member.id}>
          <ListItem>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={3}>
                <ListItemText
                  primary={member.nom}
                  secondary={member.role}
                />
              </Grid>
              <Grid item xs={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {memberTasks &&
                    memberTasks
                      .filter((task) => task.collaborateurId === member.id)
                      .map((task, taskIndex) => (
                        <React.Fragment key={task.id}>
                          <Typography variant="body2">
                            Tache {taskIndex+1} : {task.title}
                          </Typography>
                          {taskIndex !== memberTasks.length - 1 && <Divider />}
                        </React.Fragment>
                      ))
                  }
                </Box>
              </Grid>
            </Grid>
          </ListItem>
          {index !== members.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
        </div>
        {pb.authStore.model.role === 'Directeur' && (
        <div style={{ width: '400px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h2" gutterBottom>
                Ajouter un membre
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nom"
                variant="outlined"
                fullWidth
                value={nom}
                onChange={handleNomChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Rôle</InputLabel>
                <Select
                  labelId="role-label"
                  variant="outlined"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <MenuItem value="Directeur">Directeur</MenuItem>
                  <MenuItem value="ChefDeProjet">Chef de Projet</MenuItem>
                  <MenuItem value="Collaborateur">Collaborateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegistration}
              disabled={loading}
            >
              {loading ? 'Enregistrement en cours...' : 'Enregistrer'}
            </Button>
            {registrationSuccess && (
              <Alert severity="success">Enregistrement réussi !</Alert>
            )}
          </Grid>
          </Grid>
        </div>
        )}
      </Box>
    </>
  );
}
