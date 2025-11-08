import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as NoteBindings from '../../wailsjs/go/bindings/NoteBindings';
import * as ClientBindings from '../../wailsjs/go/bindings/ClientBindings';
import * as ProjectBindings from '../../wailsjs/go/bindings/ProjectBindings';
import { models } from '../../wailsjs/go/models';

export default function NoteEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState(new models.Note());
  const [clients, setClients] = useState<models.Client[]>([]);
  const [projects, setProjects] = useState<models.Project[]>([]);

  useEffect(() => {
    ClientBindings.GetAll().then(setClients).catch(console.error);
    ProjectBindings.GetAll().then(setProjects).catch(console.error);

    if (id) {
      NoteBindings.GetByID(Number(id)).then((n) => setNote(new models.Note(n))).catch(console.error);
    }
  }, [id]);

  const handleChange = (field: keyof models.Note, value: any) => {
    setNote(new models.Note({ ...note, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (id) await NoteBindings.Update(note);
      else await NoteBindings.Create(note);
      navigate('/notes');
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении заметки');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Редактировать заметку' : 'Новая заметка'}</h1>
      <textarea placeholder="Содержание" value={note.Content || ''} onChange={(e) => handleChange('Content', e.target.value)} className="w-full mb-2 p-2 border rounded" />
      
      <select value={note.ClientID || ''} onChange={(e) => handleChange('ClientID', Number(e.target.value))} className="w-full mb-2 p-2 border rounded">
        <option value="">Выберите клиента</option>
        {clients.map(c => <option key={c.ID} value={c.ID}>{c.Name}</option>)}
      </select>

      <select value={note.ProjectID || ''} onChange={(e) => handleChange('ProjectID', Number(e.target.value))} className="w-full mb-2 p-2 border rounded">
        <option value="">Выберите проект</option>
        {projects.map(p => <option key={p.ID} value={p.ID}>{p.Name}</option>)}
      </select>

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Сохранить</button>
    </div>
  );
}
