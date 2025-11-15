import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../components/CreateEditPage";
import * as TaskBindings from "../../wailsjs/go/bindings/TaskBindings";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import { models } from "../../wailsjs/go/models";

type Task = models.Task;
type TaskSearch = models.TaskSearch;
type Employee = models.Employee;
type Project = models.Project;

const statusOptions = [
  { value: "New", label: "Новая" },
  { value: "InProgress", label: "В работе" },
  { value: "Completed", label: "Завершена" },
  { value: "Canceled", label: "Отменена" },
];

export default function TaskList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([EmployeeBindings.GetAll(), ProjectBindings.GetAll()])
      .then(([allEmployees, allProjects]) => {
        setEmployees(allEmployees);
        setProjects(allProjects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchTasks = (criteria: TaskSearch) => {
    return TaskBindings.Search(criteria);
  };

  const deleteTask = async (t: Task) => {
    await TaskBindings.Delete(t.ID);
  };

  const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    try {
      return new Date(isoDate).toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  if (loading) return <div>Загрузка данных для фильтров...</div>;

  const taskSearchFields: FieldConfig<TaskSearch>[] = [
    { name: "query", label: "Поиск по тексту", type: "text" },
    {
      name: "status",
      label: "Статус",
      type: "select",
      options: statusOptions,
    },
    {
      name: "assigned_to",
      label: "Исполнитель",
      type: "select",
      options: employees.map((e) => ({ value: e.ID, label: e.Name })),
    },
    {
      name: "project_id",
      label: "Проект",
      type: "select",
      options: projects.map((p) => ({ value: p.ID, label: p.Name })),
    },
    {
      name: "deadline",
      label: "Срок до",
      type: "date",
    },
  ];

  const initialSearch: TaskSearch = {
    query: "",
    status: "",
  } as TaskSearch;

  return (
    <ListPage<Task, TaskSearch>
      title="Задачи"
      headers={[
        "Название",
        "Исполнитель",
        "Проект ID",
        "Статус",
        "Срок",
        "Действия",
      ]}
      fetchItems={fetchTasks}
      createLink="/tasks/edit"
      onDelete={deleteTask}
      searchFields={taskSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(t, idx, handleDelete) => (
        <tr key={t.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2">{t.Title}</td>            
          <td className="p-2 w-48">
            {t.Employee ? t.Employee.Name : "Не назначен"}
          </td>
          <td className="p-2 w-24">{t.ProjectID || "Нет"}</td>
          <td className="p-2 w-32">{t.Status}</td>
          <td className="p-2 w-32">{formatDate(t.Deadline)}</td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/tasks/edit/${t.ID}`}
                className="text-blue-500 hover:text-blue-700"
                title="Редактировать"
              >
                ✏️
              </Link>
              {handleDelete && (
                <button
                  onClick={() => handleDelete(t)}
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
