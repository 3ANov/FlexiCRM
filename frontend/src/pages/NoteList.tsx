import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../types/forms";
import * as NoteBindings from "../../wailsjs/go/bindings/NoteBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import { models } from "../../wailsjs/go/models";
import React, { useState, useEffect } from "react";

type Note = models.Note;
type NoteSearch = models.NoteSearch;
type Client = models.Client;
type Project = models.Project;

export default function NoteList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ClientBindings.GetAll(), ProjectBindings.GetAll()])
      .then(([allClients, allProjects]) => {
        setClients(allClients);
        setProjects(allProjects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchNotes = (criteria: NoteSearch) => {
    return NoteBindings.Search(criteria);
  };

  const deleteNote = async (note: Note) => {
    await NoteBindings.Delete(note.ID);
  };

  if (loading) return <div>Загрузка данных для фильтров...</div>;

  const noteSearchFields: FieldConfig<NoteSearch>[] = [
    { name: "query", label: "Поиск по тексту", type: "text" },
    {
      name: "client_id",
      label: "Клиент",
      type: "select",
      options: clients.map((c) => ({ value: c.ID, label: c.Name })),
    },
    {
      name: "project_id",
      label: "Проект",
      type: "select",
      options: projects.map((p) => ({ value: p.ID, label: p.Name })),
    },
  ];

  const initialSearch: NoteSearch = {
    query: "",
  } as NoteSearch;

  return (
    <ListPage<Note, NoteSearch>
      title="Заметки"
      headers={["Содержание", "Действия"]}
      fetchItems={fetchNotes}
      createLink="/notes/edit"
      onDelete={deleteNote}
      searchFields={noteSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(n, idx, handleDelete) => (
        <tr key={n.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2 flex-1">
            {n.Content
              ? n.Content.substring(0, 100) +
                (n.Content.length > 100 ? "..." : "")
              : "Нет содержания"}
          </td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/notes/edit/${n.ID}`}
                className="text-blue-500 hover:text-blue-700"
                title="Редактировать"
              >
                ✏️
              </Link>
              {handleDelete && (
                <button
                  onClick={() => handleDelete(n)}
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
