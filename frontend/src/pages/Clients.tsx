import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ClientBindings from '../../wailsjs/go/bindings/ClientBindings';
import { models } from '../../wailsjs/go/models';

export default function Clients() {
  const [clients, setClients] = useState<models.Client[]>([]);
  const [search, setSearch] = useState('');

  const loadClients = async () => {
    const all = search
      ? await ClientBindings.Search(search)
      : await ClientBindings.GetAll();
    setClients(all);
  };

  useEffect(() => {
    loadClients();
  }, [search]);

  const handleDelete = async (client: models.Client) => {
    if (confirm(`Удалить клиента "${client.Name}"?`)) {
      await ClientBindings.Delete(client, client.ID);
      loadClients();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <Link
          to="/clients/edit"
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Создать клиента
        </Link>
      </div>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Имя</th>
            <th className="p-2">Телефон</th>
            <th className="p-2">Email</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.ID} className="border-t">
              <td className="p-2">{c.ID}</td>
              <td className="p-2">{c.Name}</td>
              <td className="p-2">{c.Phone}</td>
              <td className="p-2">{c.Email}</td>
              <td className="p-2">
                <Link
                  to={`/clients/edit/${c.ID}`}
                  className="text-blue-500 mr-2"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(c)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
