import React, { useState } from 'react';
import CreateProjet from '../lib/CreateProjet';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: 8, // Added border-radius
  boxShadow: 15,
  p: 4,
};

export default function TransitionsModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Stack direction="row" justifyContent="center" sx={{ margin: 3 }} spacing={2}>
        <Fab color="primary"  variant="contained" onClick={handleOpen} aria-label="Add">
          <AddIcon />
        </Fab>
      </Stack>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CreateProjet handleClose={handleClose} />
            <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={handleClose}>Annuler</Button>
        </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
