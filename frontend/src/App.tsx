import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import EditClient from './pages/EditClient';
import Notes from './pages/Notes';
import EditNote from './pages/EditNote';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/clients" />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/edit" element={<EditClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />

          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/edit" element={<EditNote />} />
          <Route path="/notes/edit/:id" element={<EditNote />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
