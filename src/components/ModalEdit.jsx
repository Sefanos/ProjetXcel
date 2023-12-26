import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import EditProjet from '../lib/EditProjet';


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

export default function ModalEdit({ taskData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = (event) => {
    event.stopPropagation(); 
    setOpen(true);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  return (
        <div>
        <IconButton onClick={handleOpen}>
          <EditIcon style={{ color: 'green' }} />
        </IconButton>
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
            <EditProjet taskData={taskData} handleClose={handleClose} />
              <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={1}>
                <Button onClick={handleClose}>Annuler</Button>
          </Stack>
            </Box>
          </Fade>
        </Modal>
      </div>
  );
}

