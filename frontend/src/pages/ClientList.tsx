import React from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../components/ListPage';
import * as ClientBindings from '../../wailsjs/go/bindings/ClientBindings';
import { models } from '../../wailsjs/go/models';

export default function ClientList() {
  const fetchClients = (search: string) => {
    return search ? ClientBindings.Search(search) : ClientBindings.GetAll();
  };

  const deleteClient = async (client: models.Client) => {
    await ClientBindings.Delete(client.ID); 
  };


  return (
    <ListPage<models.Client>
      title="Клиенты"
      headers={['Имя', 'Телефон', 'Email', 'Действия']}
    
      fetchItems={fetchClients} 
      
      createLink="/clients/edit"

      onDelete={deleteClient}
      
      renderRow={(c, idx, handleDelete) => (
        <tr key={c.ID} className="border-t">
          <td className="p-2 text-center">{idx + 1}</td>
          <td className="p-2">{c.Name}</td>
          <td className="p-2">{c.Phone}</td>
          <td className="p-2">{c.Email}</td>
          <td className="p-2">
            <Link
              to={`/clients/edit/${c.ID}`}
              className="text-blue-500 mr-2 hover:text-blue-700"
              title="Редактировать"
            >
              ✏️
            </Link>
            {handleDelete && (
              <button
                onClick={() => handleDelete(c)}
                className="text-red-500 hover:text-red-700"
                title="Удалить"
              >
                🗑️
              </button>
            )}
          </td>
        </tr>
      )}
    />
  );
}