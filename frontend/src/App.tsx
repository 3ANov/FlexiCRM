import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import ClientList from "./pages/ClientList";
import ClientEdit from "./pages/ClientEdit";

import NoteList from "./pages/NoteList";
import NoteEdit from "./pages/NoteEdit";

import ProjectList from "./pages/ProjectList";
import ProjectEdit from "./pages/ProjectEdit";

import Transactions from "./pages/TransactionList";
import TransactionEdit from "./pages/TransactionEdit";

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/clients" />} />

          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/edit/:id?" element={<ClientEdit />} />

          <Route path="/notes" element={<NoteList />} />
          <Route path="/notes/edit/:id?" element={<NoteEdit />} />

          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/edit/:id?" element={<ProjectEdit />} />

          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/edit/:id?" element={<TransactionEdit />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
