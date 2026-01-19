import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import ClientList from "./pages/ClientList";
import ClientEdit from "./pages/ClientEdit";

import NoteList from "./pages/NoteList";
import NoteEdit from "./pages/NoteEdit";

import ProjectList from "./pages/ProjectList";
import ProjectEdit from "./pages/ProjectEdit";

import TransactionList from "./pages/TransactionList";
import TransactionEdit from "./pages/TransactionEdit";

import EmployeeList from "./pages/EmployeeList";
import EmployeeEdit from "./pages/EmployeeEdit";

import TaskList from "./pages/TaskList";
import TaskEdit from "./pages/TaskEdit";

import TemplateList from "./pages/TemplateList";
import TemplateEdit from "./pages/TemplateEdit";
import EmployeeDocumentList from "./pages/EmployeeDocumentList";
import EmployeeDocumentEdit from "./pages/EmployeeDocumentEdit";
import ClientDocumentList from "./pages/ClientDocumentList";
import ClientDocumentEdit from "./pages/ClientDocumentEdit";

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/clients" />} />

          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/edit/:id?" element={<ClientEdit />} />
          <Route path="/clients/:clientId/documents" element={<ClientDocumentList />} />
          <Route path="/clients/:clientId/documents/edit/:id" element={<ClientDocumentEdit />} />

          <Route path="/notes" element={<NoteList />} />
          <Route path="/notes/edit/:id?" element={<NoteEdit />} />

          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/edit/:id?" element={<ProjectEdit />} />

          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/edit/:id?" element={<TransactionEdit />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/edit/:id?" element={<EmployeeEdit />} />
          <Route path="/employees/:employeeId/documents" element={<EmployeeDocumentList />} />
          <Route path="/employees/:employeeId/documents/edit/:id" element={<EmployeeDocumentEdit />} />

          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/edit/:id?" element={<TaskEdit />} />

          <Route path="/templates" element={<TemplateList />} />
          <Route path="/templates/edit/:id?" element={<TemplateEdit />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
