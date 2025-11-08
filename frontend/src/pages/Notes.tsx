import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as NoteBindings from '../../wailsjs/go/bindings/NoteBindings';
import { models } from '../../wailsjs/go/models';

export default function Notes() {
  const [notes, setNotes] = useState<models.Note[]>([]);
  const [search, setSearch] = useState("");

  const loadNotes = async () => {
    const all = search
      ? await NoteBindings.Search(search)
      : await NoteBindings.GetAll();
    setNotes(all);
  };

  useEffect(() => {
    loadNotes();
  }, [search]);

  const handleDelete = async (note: models.Note) => {
    if (!window.confirm('Удалить заметку?')) return;
    try {
      await NoteBindings.Delete(note, note.ID);
      loadNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Заметки</h1>

      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <Link
          to="/notes/edit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Создать
        </Link>
      </div>

      <ul className="space-y-2">
        {notes.map((n) => (
          <li
            key={n.ID}
            className="bg-white p-3 shadow rounded flex justify-between items-center"
          >
            <span>{n.Content}</span>
            <div className="flex space-x-2">
              <Link
                to={`/notes/edit/${n.ID}`}
                className="text-blue-500 hover:text-blue-700"
                title="Редактировать"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13.5v3h3l8.586-8.586a2 2 0 00-2.828-2.828L9 13.5z"
                  />
                </svg>
              </Link>
              <button
                onClick={() => handleDelete(n)}
                className="text-red-500 hover:text-red-700"
                title="Удалить"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5-4h-6a2 2 0 00-2 2v2h10V5a2 2 0 00-2-2z"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
