import React, { useState, useEffect, useMemo } from "react";
import CreateEditPage from "../components/CreateEditPage";
import { FieldConfig } from "../types/forms";
import * as TaskBindings from "../../wailsjs/go/bindings/TaskBindings";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import { models } from "../../wailsjs/go/models";
import { getStatusOptions } from "../utils/statuses";

type Task = models.Task;
type Employee = models.Employee;
type Project = models.Project;

const INITIAL_TASK: Task = {
  ID: 0,
  Title: "",
  Description: "",
  AssignedTo: 0,
  ProjectID: 0,
  Status: "New",
  Deadline: new Date().toISOString().split("T")[0],
  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
} as Task;

export default function TaskEdit() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = useMemo(() => getStatusOptions("task"), []);

  useEffect(() => {
    Promise.all([
      EmployeeBindings.GetAll().then(setEmployees),
      ProjectBindings.GetAll().then(setProjects),
    ])
      .catch((err) => console.error("Ошибка загрузки справочников:", err))
      .finally(() => setLoading(false));
  }, []);
  const taskFields: FieldConfig<Task>[] = useMemo(
    () => [
      {
        name: "Title",
        label: "Название",
        type: "text",
        required: true,
      },
      {
        name: "Description",
        label: "Описание",
        type: "textarea",
      },
      {
        name: "AssignedTo",
        label: "Исполнитель",
        type: "select",
        options: employees.map((e) => ({ value: e.ID, label: e.Name })),
        required: true,
      },
      {
        name: "ProjectID",
        label: "Проект",
        type: "select",
        options: projects.map((p) => ({ value: p.ID, label: p.Name })),
        required: true,
      },
      {
        name: "Status",
        label: "Статус",
        type: "select",
        options: statusOptions,
        required: true,
      },
      {
        name: "Deadline",
        label: "Срок",
        type: "datetime-local",
      },
    ],
    [employees, projects, statusOptions],
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Загрузка данных формы...
      </div>
    );
  }

  return (
    <CreateEditPage<Task>
      key="task-edit-page"
      title="Управление задачей"
      listRoute="/tasks"
      fetchById={TaskBindings.GetByID}
      create={TaskBindings.Create}
      update={TaskBindings.Update}
      initialValue={INITIAL_TASK}
      fields={taskFields}
    />
  );
}
