import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import pb, { login } from '../lib/PocketBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Footer from './Fixes/Footer';
import { logUserActivity } from '../lib/LogActivity';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      window.alert('Authentification invalide');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      logUserActivity(pb.authStore.model.id ,'Logged in');
      setLoading(false);
    } catch (error) {
      window.alert("Échec de l'authentification. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Project Management
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'Arial, sans-serif',
            }}
            mt={4}
          >
            Connectez-vous
          </Typography>
          <Typography
            variant="p"
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            Bienvenus dans votre espace
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgb(238, 238, 238)',
              borderRadius: '4px',
              boxShadow: 'none',
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            mt={2}
            noValidate
            autoComplete="off"
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <TextField
                  label="Email"
                  style={{ width:350}}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  required
                />
                <FormControl style={{ width:350 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleChangePassword}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  size="large"
                  style={{ width: 418 }}
                >
                  {isLoading ? 'Loading' : 'Connecter'}
                </Button>
              </>
            )}
          </Box>
        </Container>

        User demo account : guest@test.com:123456789

        <Footer />
      </Box>
    </>
  );
}
