import React, { useState, useEffect } from 'react';
import Sidebar from './Fixes/Sidebar';
import Box from '@mui/material/Box';
import ProjetList from '../components/ProjetList';
import Toolbar from '@mui/material/Toolbar';
import Bread from '../components/Bread';
import SearchResultsComponent from '../components/SearchResults';
import pb from '../lib/PocketBase';

export default function Projects() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedRecordId, setHighlightedRecordId] = useState('');

  const handleResultClick = (id) => {
    setSearchResults([]);
    setHighlightedRecordId(id);

    setTimeout(() => {
      setHighlightedRecordId('');
    }, 9000); // Clear highlightedRecordId after 15 seconds
  };

  const handleSearchQuery = async (query) => {
    try {
      setSearchQuery(query);

      if (query.trim() === '') {
        setSearchResults([]); // Clear search results if the query is empty
        return;
      }

      const encodedQuery = encodeURIComponent(query);
      const resultList = await pb.collection('Projects').getList(1, 50, {
        filter: `titre~"${encodedQuery}"`,
      });

      setSearchResults(resultList.items);
    } catch (error) {
      console.error('Error occurred during search:', error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Sidebar onSearchQuery={handleSearchQuery} searchQuery={searchQuery} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Bread />
          {searchResults.length > 0 ? (
            <SearchResultsComponent results={searchResults} onResultClick={handleResultClick} />
          ) : (
            <ProjetList highlightedRecordId={highlightedRecordId} />
          )}
        </Box>
      </Box>
    </>
  );
}
