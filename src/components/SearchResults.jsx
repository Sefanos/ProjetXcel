import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const SearchResultsComponent = ({ results, onResultClick }) => {

    const handleResultClick = (id) => {
      onResultClick(id);
    };

  if (!results || results.length === 0) {
    return <p>No search results found.</p>;
  }

  return (
    <TableContainer sx={{width : 800}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Titre</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date de Realisation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id} onClick={(e) => handleResultClick(result.id)} hover>
              <TableCell>{result.titre}</TableCell>
              <TableCell>{result.description}</TableCell>
              <TableCell>{new Date(result.dateDecheance).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResultsComponent;
