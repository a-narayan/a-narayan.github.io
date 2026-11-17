import React from 'react';
import TopHeading from './sections/TopHeading';
import Welcome from './sections/Welcome';
import IDSLResearch from './sections/IDSLResearch';
import Recruitment from './sections/Recruitment';
import Highlights from './sections/Highlights';
import News from './sections/News';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <TopHeading />
      <Welcome />
      <IDSLResearch />
      <Highlights />
      <News />
      <Recruitment />
    </Box>
  );
};

export default Home;
