import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import { models } from "../../wailsjs/go/models";

type Project = models.Project;

export default function ProjectList() {
  const fetchProjects = (search: string) => {
    return search ? ProjectBindings.Search(search) : ProjectBindings.GetAll();
  };

  const deleteProject = async (p: Project) => {
    await ProjectBindings.Delete(p.ID);
  };

  return (
    <ListPage<Project>
      title="Проекты"
      headers={["Название", "Клиент", "Статус", "Действия"]}
      fetchItems={fetchProjects}
      createLink="/projects/edit"
      onDelete={deleteProject}
      renderRow={(p, idx, handleDelete) => (
        <tr key={p.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2">{p.Name}</td>
          <td className="p-2 w-48">{p.ClientID || "Не выбран"}</td>

          <td className="p-2 w-32">{p.Status}</td>

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
