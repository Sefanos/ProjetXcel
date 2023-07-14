  import React, { useState, useEffect } from 'react';
  import styled from '@emotion/styled';
  import { DragDropContext, Droppable } from 'react-beautiful-dnd';
  import TaskCard from './TaskLits';
  import { columnsFromBackend } from '../lib/TacheData';
  import pb from '../lib/PocketBase';
  import { useParams } from 'react-router-dom';
  import AjouerTask from './ModalTask';
  import CloseIcon from '@mui/icons-material/Close';
  import IconButton from '@mui/material/IconButton';
  import Stack from '@mui/material/Stack';
  import CircularProgress from '@mui/material/CircularProgress';
  import Grid from '@mui/material/Grid';
  import Fab from '@mui/material/Fab';
  import AddIcon from '@mui/icons-material/Add';
  import Modal from '@mui/material/Modal';
  import CreateColumn from '../lib/CreateColumn';
  import Box from '@mui/material/Box';
  import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
  import Tooltip from '@mui/material/Tooltip';
  

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
    borderRadius: '8px', // Add rounded edges
  };


  const Container = styled.div`
    display: flex;
  `;

  const TaskList = styled.div`
    min-height: 100px;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    min-width: 341px;
    border-radius: 5px;
    padding: 15px 15px;
    margin-right: 45px;
    position: relative;
  `;


  const TaskColumnStyles = styled.div`
    margin: 8px;
    display: flex;
    width: 100%;
    min-height: 20vh;
  `;

  const Title = styled.span`
    color: #10957d;
    background: rgba(16, 149, 125, 0.15);
    padding: 2px 10px;
    border-radius: 5px;
    align-self: center;
  `;

  const DeleteButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    background: transparent;
    border: none;
    color: #aaa;
    cursor: pointer;
  `;


  const Kanban = () => {
    const [columns, setColumns] = useState({});
    const {projectId} = useParams();
    const [userRole, setUserRole] = useState('');
    const [userCurrent , setUserCurrent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [isTaskCreated, setIsTaskCreated] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
      // Function to fetch user's role from your authentication system
      const fetchUserRole = async () => {
        try {
          // Retrieve the user's role from your authentication system
          const role = pb.authStore.model.role; // Replace this with your actual logic to fetch the user's role
          setUserRole(role);

          const userId = pb.authStore.model.id; // Replace this with your actual logic to fetch the user's id
          setUserCurrent(userId);
        } catch (error) {
          console.log('Error fetching user role:', error);
        }
      };

      fetchUserRole();
    }, []);

    useEffect(() => {
      const fetchColumnsData = async () => {
        try {
          const cachedColumns = localStorage.getItem('kanbanColumns');
          if (cachedColumns) {
            setColumns(JSON.parse(cachedColumns));
          }

          const fetchedColumns = await columnsFromBackend(projectId, userRole, userCurrent);
          setColumns(fetchedColumns);
          localStorage.setItem('kanbanColumns', JSON.stringify(fetchedColumns));
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setIsLoading(false);
          
          setIsTaskCreated(false); // Set isTaskCreated to false here

        } catch (error) {
          console.error('Error fetching columns:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchColumnsData();
    }, [projectId, userRole, userCurrent ,isTaskCreated]);

    const onDragEnd = async (result) => {
      if (!result.destination) return;
      const { source, destination } = result;
      const sourceColumnId = source.droppableId;
      const destinationColumnId = destination.droppableId;

      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        });

        const taskId = sourceColumn.items[source.index].id;
        const updatedTask = {
          ...sourceColumn.items[source.index],
          columnId: destinationColumnId,
        };

        try {
          await pb.collection('Tasks').update(taskId, updatedTask);
          console.log('Task updated in the database');
        } catch (error) {
          console.error('Error updating task in the database:', error);
        }
      }
    };

    const handleDeleteTask = async (taskId) => {
      try {
        // Delete the task from the database
        await pb.collection('Tasks').delete(taskId);
        console.log('Task deleted from the database');
  
        // Update the state to remove the task from the columns
        setColumns((prevColumns) => {
          const updatedColumns = { ...prevColumns };
          Object.values(updatedColumns).forEach((column) => {
            column.items = column.items.filter((item) => item.id !== taskId);
          });
          return updatedColumns;
        });
      } catch (error) {
        console.error('Error deleting task from the database:', error);
      }
    };
  
    
    const deleteColumn = async (columnId) => {
      // Create a copy of the columns object
      const updatedColumns = { ...columns };
    
      // Get the column to be deleted
      const column = updatedColumns[columnId];
    
      // Delete the column from the updatedColumns object
      delete updatedColumns[columnId];
    
      // Delete the associated tasks
      const taskIds = column.items.map((item) => item.id);
    
      try {
        // Delete the tasks from the database
        await Promise.all(
          taskIds.map((taskId) => pb.collection('Tasks').delete(taskId))
        );
        console.log('Tasks deleted from the database');
    
        // Delete the column from the database
        await pb.collection('Columns').delete(columnId);
        console.log('Column deleted from the database');
      } catch (error) {
        console.error('Error deleting tasks or column from the database:', error);
      }
    
      // Update the state with the updatedColumns object
      setColumns(updatedColumns);
    };
    
    
    

    const createColumn = async (newColumn) => {
      try {
        // Create the column in the database
        const createdColumn = await pb.collection('Columns').create(newColumn);
        console.log('Record created:', createdColumn);
    
        // Update the columns state with the newly created column
        setColumns((prevColumns) => ({
          ...prevColumns,
          [createdColumn.id]: {
            id: createdColumn.id,
            title: createdColumn.title,
            items: [],
          },
        }));
      } catch (error) {
        console.error('Error creating record:', error);
      }
    };
    
    const addNewColumn = (title) => {
      const newColumn = {
        title,
        ProjectId: projectId,
      };
    
      createColumn(newColumn);
    };


    if (isLoading) {
      return (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '50vh' }}
        >
          <CircularProgress />
        </Grid>
      );
    }
    
    return (
      <>
      {userRole === 'Directeur' && (
          <Box sx={{ position: 'fixed', bottom: 16, right: 16 ,zIndex: 999}} >
              <Fab size="large" color="secondary" aria-label="add" onClick={handleOpen}>
                  <AddIcon />
              </Fab>
          </Box>
          )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <CreateColumn addNewColumn={addNewColumn} projectId={projectId} />
          </Box>
        </Modal>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          <TaskColumnStyles>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Stack direction="row" justifyContent="center" spacing={2}>
                        <Title>{column.title} </Title>
                        {userRole === 'Directeur' && (
                          <>
                        <AjouerTask columnId={columnId} projectId={projectId}  setIsTaskCreated={setIsTaskCreated} />
                        <DeleteButton onClick={() => deleteColumn(columnId)}>
                        <Tooltip title="Supprimer" placement="top">
                          <DeleteForeverIcon />
                          </Tooltip>
                        </DeleteButton>
                          </>
                        )}
                      </Stack>
                      
                      {column.items.map((item, index) => (
                        <TaskCard key={item.id} item={item} index={index} columnId={columnId} handleDeleteTask={handleDeleteTask} />
                      ))}
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
              );
            })} 
          </TaskColumnStyles>
        </Container>
      </DragDropContext>
      
      </>
    );
  };

  export default Kanban;