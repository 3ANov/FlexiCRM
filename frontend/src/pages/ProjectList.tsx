import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../types/forms";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";
import { getStatusLabel, getStatusOptions } from "../utils/statuses";

type Project = models.Project;
type ProjectSearch = models.ProjectSearch;
type Client = models.Client;

const statusOptions = getStatusOptions("project");

export default function ProjectList() {
  const [clientOptions, setClientOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [clientMap, setClientMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    ClientBindings.GetAll()
      .then((clients: Client[]) => {
        const options = clients.map((c) => ({
          value: c.ID,
          label: c.Name,
        }));
        setClientOptions(options);

        const map = new Map<number, string>();
        clients.forEach((c) => {
          map.set(c.ID, c.Name);
        });
        setClientMap(map);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке клиентов:", err);
      });
  }, []);

  const getClientName = (clientID: number | undefined): string => {
    if (!clientID) return "Не выбран";
    return clientMap.get(clientID) || "Неизвестный клиент";
  };

  const fetchProjects = (criteria: ProjectSearch) => {
    return ProjectBindings.Search(criteria);
  };

  const deleteProject = async (p: Project) => {
    await ProjectBindings.Delete(p.ID);
  };

  const projectSearchFields: FieldConfig<ProjectSearch>[] = [
    { name: "query", label: "Поиск по названию", type: "text" },
    {
      name: "client_id",
      label: "Клиент",
      type: "select",
      options: clientOptions,
    },
    {
      name: "status",
      label: "Статус",
      type: "select",
      options: statusOptions,
    },
  ];

  const initialSearch: ProjectSearch = {
    query: undefined,
    client_id: undefined,
    status: undefined,
  } as ProjectSearch;

  return (
    <ListPage<Project, ProjectSearch>
      title="Проекты"
      headers={["Название", "Клиент", "Статус", "Действия"]}
      fetchItems={fetchProjects}
      createLink="/projects/edit"
      onDelete={deleteProject}
      searchFields={projectSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(p, idx, handleDelete) => (
        <tr key={p.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2">{p.Name}</td>
          <td className="p-2 w-48">{getClientName(p.ClientID)}</td>
          <td className="p-2 w-32">{getStatusLabel(p.Status, "project")}</td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/projects/edit/${p.ID}`}
                className="text-blue-500 hover:text-blue-700"
                title="Редактировать"
              >
                ✏️
              </Link>
              {handleDelete && (
                <button
                  onClick={() => handleDelete(p)}
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
