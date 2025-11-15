import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../components/CreateEditPage";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import { models } from "../../wailsjs/go/models";

type Employee = models.Employee;
type EmployeeSearch = models.EmployeeSearch;

const activeOptions = [
  { value: "true", label: "Активный" },
  { value: "false", label: "Неактивный" },
];

export default function EmployeeList() {
  const fetchEmployees = (criteria: EmployeeSearch) => {
    return EmployeeBindings.Search(criteria);
  };

  const deleteEmployee = async (e: Employee) => {
    await EmployeeBindings.Delete(e.ID);
  };

  const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    try {
      return new Date(isoDate).toLocaleDateString();
    } catch {
      return "";
    }
  };

  const employeeSearchFields: FieldConfig<EmployeeSearch>[] = [
    { name: "query", label: "Поиск по имени/должности/тел.", type: "text" },
    {
      name: "active",
      label: "Активность",
      type: "select",
      options: activeOptions,
    },
  ];

  const initialSearch: EmployeeSearch = {
    query: "",
    active: undefined,
  };

  return (
    <ListPage<Employee, EmployeeSearch>
      title="Сотрудники"
      headers={[
        "Имя",
        "Должность",
        "Телефон",
        "Активный",
        "Создан",
        "Действия",
      ]}
      fetchItems={fetchEmployees}
      createLink="/employees/edit"
      onDelete={deleteEmployee}
      searchFields={employeeSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(e, idx, handleDelete) => (
        <tr key={e.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2">{e.Name}</td>
          <td className="p-2 w-32">{e.Role}</td>
          <td className="p-2 w-32">{e.Phone}</td>
          <td className="p-2 w-24 text-center">{e.Active ? "✅" : "❌"}</td>
          <td className="p-2 w-32">{formatDate(e.CreatedAt)}</td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/employees/edit/${e.ID}`}
                className="text-blue-500 hover:text-blue-700"
                title="Редактировать"
              >
                ✏️
              </Link>
              {handleDelete && (
                <button
                  onClick={() => handleDelete(e)}
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
