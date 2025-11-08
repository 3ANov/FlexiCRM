import React from 'react';

const mockClients = [
  { id: 1, name: 'ООО Ромашка', phone: '+7 900 123-45-67' },
  { id: 2, name: 'ИП Иванов', phone: '+7 901 555-44-33' },
];

export default function Clients() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Имя</th>
            <th className="p-2">Телефон</th>
          </tr>
        </thead>
        <tbody>
          {mockClients.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
