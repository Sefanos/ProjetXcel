import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/ProjetsPage';
import Members from './pages/MembersPage';
import Tasks from './pages/TasksPage';
import Login from './pages/Login';
import {isUserValid} from './lib/PocketBase';



const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route index element={isUserValid?<Home />:<Navigate to="Login" />} />
          <Route path="/Projets" element={isUserValid ? <Projects /> : <Navigate to="Login" />} />
          <Route path="/Members" element={isUserValid?<Members />:<Navigate to="Login" />} />
          <Route path="/Tasks/:projectId" element={isUserValid?<Tasks />:<Navigate to="Login" />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
