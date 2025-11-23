import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../types/forms";
import * as TaskBindings from "../../wailsjs/go/bindings/TaskBindings";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import * as ProjectBindings from "../../wailsjs/go/bindings/ProjectBindings";
import { models } from "../../wailsjs/go/models";
import { getStatusLabel, getStatusOptions } from "../utils/statuses";

type Task = models.Task;
type TaskSearch = models.TaskSearch;
type Employee = models.Employee;
type Project = models.Project;

const statusOptions = getStatusOptions("task");

export default function TaskList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Map<number, string>>(
    new Map()
  );
  const [projectMap, setProjectMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([EmployeeBindings.GetAll(), ProjectBindings.GetAll()])
      .then(([allEmployees, allProjects]) => {
        setEmployees(allEmployees);
        setProjects(allProjects);

        const eMap = new Map<number, string>();
        allEmployees.forEach((e) => eMap.set(e.ID, e.Name));
        eMap.set(0, "	Не выбран");
        setEmployeeMap(eMap);

        const pMap = new Map<number, string>();
        allProjects.forEach((p) => pMap.set(p.ID, p.Name));
        pMap.set(0, "	Не выбран");
        setProjectMap(pMap);
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
    } catch {
      return "";
    }
  };

  const getEmployeeName = (id: number): string => {
    return employeeMap.get(id) || "Неизвестный сотрудник";
  };

  const getProjectName = (id: number): string => {
    return projectMap.get(id) || "Неизвестный проект";
  };

  if (loading) return <div>Загрузка данных для фильтров...</div>;

  const taskSearchFields: FieldConfig<TaskSearch>[] = [
    { name: "query", label: "Поиск по тексту", type: "text" },
    { name: "status", label: "Статус", type: "select", options: statusOptions },
    {
      name: "assigned_to",
      label: "Исполнитель",
      type: "select",
      options: [
        { value: 0, label: "Не выбран" },
        ...employees.map((e) => ({ value: e.ID, label: e.Name })),
      ],
    },
    {
      name: "project_id",
      label: "Проект",
      type: "select",
      options: [
        { value: 0, label: "Не выбран" },
        ...projects.map((p) => ({ value: p.ID, label: p.Name })),
      ],
    },
    { name: "deadline", label: "Срок до", type: "date" },
  ];

  const initialSearch: TaskSearch = {
    query: "",
    status: "",
    assigned_to: undefined,
    project_id: undefined,
    deadline: undefined,
  } as TaskSearch;

  return (
    <ListPage<Task, TaskSearch>
      title="Задачи"
      headers={[
        "Название",
        "Исполнитель",
        "Проект",
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
          <td className="p-2 w-48">{getEmployeeName(t.AssignedTo)}</td>
          <td className="p-2 w-24">{getProjectName(t.ProjectID)}</td>
          <td className="p-2 w-32">{getStatusLabel(t.Status, "task")}</td>
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
