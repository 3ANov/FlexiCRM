import React, { useState, useEffect } from "react";
import CreateEditPage, { FieldConfig } from "../components/CreateEditPage";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";

type Project = models.Project;
const statusOptions = [
  { value: "New", label: "Новый" },
  { value: "InProgress", label: "В работе" },
  { value: "Completed", label: "Завершён" },
];

export default function ProjectEdit() {
  const [clients, setClients] = useState<models.Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ClientBindings.GetAll()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка данных формы...</div>;

  const initialProject: Project = {
    ID: 0,
    Name: "",
    Description: "",
    Status: "New",
    ClientID: 0,
  } as Project;

  const projectFields: FieldConfig<Project>[] = [
    { name: "Name", label: "Название", type: "text" },
    { name: "Description", label: "Описание", type: "textarea" },
    {
      name: "Status",
      label: "Статус",
      type: "select",
      options: statusOptions,
    },
    {
      name: "ClientID",
      label: "Клиент",
      type: "select",
      options: clients.map((c) => ({ value: c.ID, label: c.Name })),
    },
  ];

  return (
    <CreateEditPage<Project>
      key={ProjectBindings.GetByID.name}
      title="Управление проектом"
      listRoute="/projects"
      fetchById={ProjectBindings.GetByID}
      create={ProjectBindings.Create}
      update={ProjectBindings.Update}
      initialValue={initialProject}
      fields={projectFields}
    />
  );
}
