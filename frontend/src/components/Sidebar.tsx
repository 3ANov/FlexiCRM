import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/clients", label: "Клиенты" },
  { to: "/notes", label: "Заметки" },
  { to: "/projects", label: "Проекты" },
  { to: "/transactions", label: "Транзакции" },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="text-2xl font-bold p-4 border-b border-gray-700">
        FlexiCRM
      </div>
      <nav className="flex-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
