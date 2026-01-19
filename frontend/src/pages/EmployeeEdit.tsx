import CreateEditPage from "../components/CreateEditPage";
import { FieldConfig } from "../types/forms";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import { models } from "../../wailsjs/go/models";

type Employee = models.Employee;

export default function EmployeeEdit() {
  const initialEmployee: Employee = {
    ID: 0,
    Name: "",
    Role: "",
    Email: "",
    Phone: "",
    Active: true,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  } as Employee;

  const employeeFields: FieldConfig<Employee>[] = [
    { name: "Name", label: "Имя", type: "text" },
    { name: "Role", label: "Должность", type: "text" },
    { name: "Email", label: "Email", type: "email" },
    { name: "Phone", label: "Телефон", type: "text" },
    { name: "Active", label: "Активный", type: "checkbox" },
  ];

  return (
    <CreateEditPage<Employee>
      key={EmployeeBindings.GetByID.name}
      title="Управление сотрудником"
      listRoute="/employees"
      fetchById={EmployeeBindings.GetByID}
      create={EmployeeBindings.Create}
      update={EmployeeBindings.Update}
      initialValue={initialEmployee}
      fields={employeeFields}
    />
  );
}
