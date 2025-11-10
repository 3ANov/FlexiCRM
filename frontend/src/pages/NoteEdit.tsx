import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateEditPage, { FieldConfig } from "../components/CreateEditPage";
import * as NoteBindings from "../../wailsjs/go/bindings/NoteBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import { models } from "../../wailsjs/go/models";

type Note = models.Note;

export default function NoteEdit() {
  const { id } = useParams<{ id: string }>();
  const [clients, setClients] = useState<models.Client[]>([]);
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ClientBindings.GetAll().then(setClients),
      ProjectBindings.GetAll().then(setProjects),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка данных формы...</div>;

  const initialNote: Note = {
    ID: 0,
    Content: "",
    ClientID: 0,
    ProjectID: 0,
  } as Note;

  const noteFields: FieldConfig<Note>[] = [
    { name: "Content", label: "Содержание", type: "textarea" },
    {
      name: "ClientID",
      label: "Клиент",
      type: "select",
      options: clients.map((c) => ({ value: c.ID, label: c.Name })),
    },
    {
      name: "ProjectID",
      label: "Проект",
      type: "select",
      options: projects.map((p) => ({ value: p.ID, label: p.Name })),
    },
  ];

  return (
    <CreateEditPage<Note>
      key={id || "new"}
      title="Управление заметкой"
      listRoute="/notes"
      fetchById={NoteBindings.GetByID}
      create={NoteBindings.Create}
      update={NoteBindings.Update}
      initialValue={initialNote}
      fields={noteFields}
    />
  );
}
