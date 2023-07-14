import React, { useEffect, useState } from 'react';
import pb , {deleteProject} from '../lib/PocketBase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useNavigate } from 'react-router';
import TransitionsModal from './ModalProject';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import Input from '@mui/material/Input';
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";


const ProjetList = ({ highlightedRecordId }) => {
  const [projects, setProjects] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userCurrent, setUserCurrent] = useState('');
  const [importedData, setImportedData] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const projectsData = await pb.collection('Projects').getFullList();
      const responsablesData = await pb.collection('users').getFullList({
        filter: "role = 'Directeur' || role ='ChefDeProjet'",
      });

      const updatedProjects = projectsData.map((project) => {
        const responsible = responsablesData.find((responsable) => responsable.id === project.Responsable);
        const responsibleName = responsible ? responsible.nom : '';

        return {
          id: project.id,
          Priority: project.priorite,
          Nom: project.titre,
          Description: project.description,
          Progress: project.status,
          Responsable: responsibleName,
          DateDeCreation: new Date(project.created).toLocaleDateString(),
          DateDeRealisation: new Date(project.dateDecheance).toLocaleDateString(),
        };
      });

      setProjects(updatedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = pb.authStore.model.role;
        setUserRole(role);

        const userId = pb.authStore.model.id;
        setUserCurrent(userId);
      } catch (error) {
        console.log('Error fetching user role:', error);
      }
    };

    fetchUserRole();
    fetchProjects();
  }, []);
  
  const handleDeleteProject = async (event, projectId) => {
    event.stopPropagation(); // Prevent click event propagation

    try {
      await deleteProject(projectId);
      const updatedProjects = projects.filter((project) => project.id !== projectId);
      setProjects(updatedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigateToTasks = (projectId) => {
    navigate(`/Tasks/${projectId}`);
  };

  const getPriorityIcon = (priority) => {
    let icon = null;

    if (priority === 'high') {
      icon = <ArrowUpwardRoundedIcon style={{ color: 'red' }} />;
    } else if (priority === 'medium') {
      icon = <ArrowUpwardRoundedIcon style={{ color: 'orange' }} />;
    } else if (priority === 'low') {
      icon = <ArrowDownwardRoundedIcon style={{ color: 'green', fontSize: 20 }} />;
    }

    return icon;
  };

  
  const handleExportToExcel = () => {
    const shouldDownload = window.confirm('Êtes-vous sûr de vouloir télécharger le fichier?');
    if (shouldDownload) {
      const data = projects.map((project) => ({
        'Priorité': project.Priority,
        'Titre': project.Nom,
        'Description': project.Description,
        'Statut': project.Progress ,
        'Responsable': project.Responsable,
        'Date De Création': project.DateDeCreation,
        'Date De Réalisation': project.DateDeRealisation,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Projets');

      // Customize table head style
      const tableHeadStyle = {
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: { rgb: 'EFEFEF' },
        },
      };

      XLSX.utils.sheet_add_aoa(worksheet, [['Priorité', 'Titre', 'Description', 'Statut', 'Responsable', 'Date De Création', 'Date De Réalisation']], {
        origin: 'A1',
        cellStyles: true,
        header: true,
        style: tableHeadStyle,
      });

      // Customize description column width
      const descriptionColumnWidth = { wpx: 300 };
      if (!worksheet['!cols']) {
        worksheet['!cols'] = [];
      }
      worksheet['!cols'][2] = descriptionColumnWidth;

      // Customize table row properties
      const tableRowProperties = { hidden: false, hpt: 20 };
      if (!worksheet['!rows']) {
        worksheet['!rows'] = [];
      }
      worksheet['!rows'][0] = tableRowProperties;

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(dataBlob, 'projets.xlsx');
    }
  };
  
  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Access the worksheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // Convert the worksheet to JSON object
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Process the imported data as needed
      // For example, add each row to the database
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const responsableName = row[4];
        const dateDecheanceString = row[6];
        
        try {
          // Query the user data to get the ID based on the user name
          const responsablesData = await pb.collection('users').getFullList({
            filter: `nom = '${responsableName}'`,
          });
  
          if (responsablesData.length > 0) {
            const responsableId = responsablesData[0].id;
  
            const dateDecheance = new Date(dateDecheanceString);
            if (isNaN(dateDecheance.getTime())) {
              console.error('Invalid date:', dateDecheanceString);
              continue; // Skip this row and move to the next iteration
            }
  
            const projectData = {
              priorite: row[0],
              titre: row[1],
              description: row[2],
              status: row[3],
              dateDecheance: dateDecheance.toISOString(),
              Responsable: responsableId,
            };
  
            // Add the project data to the database
            await pb.collection('Projects').create(projectData);
            console.log('Project added:', projectData);
          } else {
            console.error('User not found:', responsableName);
          }
        } catch (error) {
          console.error('Error adding project:', error);
        }
      }
      
      // Fetch the updated project list after importing
      fetchProjects();
    };
    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    // Fetch the initial project list
    fetchProjects();
  }, []);

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
    {userRole === 'Directeur' && (
        <>
          <TransitionsModal />
          <Box >
          <Fab color="secondary" aria-label="Export" onClick={handleExportToExcel} style={{margin: '1em'}}>
            <FileDownloadIcon />
          </Fab>
          <Fab color="secondary" aria-label="Import">
          <label htmlFor="import-excel">
              <Input
                id="import-excel"
                type="file"
                accept=".xlsx"
                style={{ display: 'none'}}
                onChange={handleImportFromExcel}
              />
              <IconButton component="span"  style={{ color: '#fff'}}>
                <UploadIcon />
              </IconButton>
            </label>
            </Fab>
            </Box>
        </>
      )}
    </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Priorité</TableCell>
              <TableCell align="center">Titre</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Responsable</TableCell>
              <TableCell align="center">Date De Création</TableCell>
              <TableCell align="center">Date De Réalisation</TableCell>
              {userRole === 'Directeur' && (
              <TableCell align="center">Supprimer - Modifier</TableCell>
            )}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((row) => (
                <TableRow
                        key={row.id}
                        onClick={() => handleNavigateToTasks(row.id)}
                        className={row.id === highlightedRecordId ? 'highlighted' : ''}
                        hover
                >
                <TableCell align="center">{getPriorityIcon(row.Priority)}</TableCell>
                <TableCell align="center">{row.Nom}</TableCell>
                <TableCell sx={{ width: '60%' }}>{row.Description}</TableCell>
                <TableCell align="center" sx={{ width: '10%' }}>
                  <Typography variant="caption">{`${row.Progress}%`}</Typography>
                  <LinearProgress variant="determinate" value={row.Progress} />
                </TableCell>
                <TableCell align="center" sx={{ width: '15%' }}>{row.Responsable}</TableCell>
                <TableCell align="center">{row.DateDeCreation}</TableCell>
                <TableCell align="center">{row.DateDeRealisation}</TableCell>
                <TableCell align="center">
                  {userRole === 'Directeur' && (
                    <>
                      <Tooltip title="Supprimer" placement="right">
                        <IconButton onClick={(event) => handleDeleteProject(event, row.id)}>
                          <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier" placement="right">
                        <IconButton onClick={(event) => event.stopPropagation()}>
                          <EditIcon style={{ color: 'green' }} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <style>
        {`
          .highlighted {
            background-color: yellow;
          }
        `}
      </style>
    </>
  );
};

export default ProjetList;
