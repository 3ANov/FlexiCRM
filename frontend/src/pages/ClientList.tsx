import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../components/CreateEditPage";

import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";

type Client = models.Client;

type ClientSearch = models.ClientSearch;

export default function ClientList() {
  const fetchClients = (criteria: ClientSearch) => {
    return ClientBindings.Search(criteria);
  };

  const deleteClient = async (client: Client) => {
    await ClientBindings.Delete(client.ID);
  };

  const clientSearchFields: FieldConfig<ClientSearch>[] = [
    { name: "query", label: "Поиск (Имя, Телефон, Email)", type: "text" },
  ];

  const initialSearch: ClientSearch = {
    query: "",
  } as ClientSearch;

  return (
    <ListPage<Client, ClientSearch>
      title="Клиенты"
      headers={["Имя", "Телефон", "Email", "Действия"]}
      fetchItems={fetchClients}
      createLink="/clients/edit"
      onDelete={deleteClient}
      searchFields={clientSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(c, idx, handleDelete) => (
        <tr key={c.ID} className="border-t">
          <td className="p-2 w-12 text-center">{idx + 1}</td>

          <td className="p-2">{c.Name}</td>
          <td className="p-2">{c.Phone}</td>
          <td className="p-2">{c.Email}</td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/clients/edit/${c.ID}`}
                className="text-blue-500 hover:text-blue-700"
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
            </div>
          </td>
        </tr>
      )}
    />
  );
}
