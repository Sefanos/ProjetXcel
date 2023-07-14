import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import TaskDetails from './TaskDetails';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import pb from '../lib/PocketBase';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TaskInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  min-height: 106px;
  border-radius: 5px;
  max-width: 311px;
  background: white;
  margin-top: 15px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: 400px;
    color: #7d7d7d;
  }
`;

const TaskCard = ({ item, index, columnId , handleDeleteTask }) => {
  const draggableId = `${columnId}-${item.id}`;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async (event) => {
    event.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      handleDeleteTask(item.id);
      handleClose();
    }
  };
  
  return (
    <>
      <Draggable key={item.id} draggableId={draggableId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TaskInformation isDragging={snapshot.isDragging} onClick={handleOpen}>
              <p>{item.Task}</p>
              <div className="secondary-details">
                <p>
                  <span>
                    {new Date(item.Due_Date).toLocaleDateString('en-us', {
                      month: 'short',
                      day: '2-digit',
                    })}
                  </span>
                </p>
                {pb.authStore.model.role === 'Directeur' && (
                <IconButton onClick={(event) => handleDelete(event)}>
                  <DeleteIcon />
                </IconButton>
                )}
              </div>
            </TaskInformation>
          </div>
        )}
      </Draggable>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <TaskDetails task={item} />
        </Box>
      </Modal>
    </>
  );
};

export default TaskCard;
