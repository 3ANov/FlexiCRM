import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import * as NoteBindings from "../../wailsjs/go/bindings/NoteBindings";
import { models } from "../../wailsjs/go/models";

type Note = models.Note;

export default function NoteList() {
  const fetchNotes = (search: string) => {
    return search ? NoteBindings.Search(search) : NoteBindings.GetAll();
  };
  const deleteNote = async (note: Note) => {
    await NoteBindings.Delete(note.ID);
  };

  return (
    <ListPage<Note>
      title="Заметки"
      headers={["Содержание", "Действия"]}
      fetchItems={fetchNotes}
      createLink="/notes/edit"
      onDelete={deleteNote}
      renderRow={(n, idx, handleDelete) => (
        <tr key={n.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2 flex-1">
            {n.Content
              ? n.Content.substring(0, 100) +
                (n.Content.length > 100 ? "..." : "")
              : "Нет содержания"}
          </td>
          <td className="p-2 w-48 text-right">
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
