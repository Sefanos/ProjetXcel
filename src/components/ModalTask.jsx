import * as React from 'react';
import CreateTask from '../lib/CreateTask';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';


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

export default function AjouerTask({ columnId , projectId , setIsTaskCreated }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      
      <IconButton color="primary" aria-label="add" onClick={handleOpen}>
      <AddIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CreateTask columnId={columnId} projectId={projectId}  setIsTaskCreated={setIsTaskCreated} />
            <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={handleClose}>Annuler</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}