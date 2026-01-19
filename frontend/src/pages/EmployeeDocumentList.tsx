import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import * as EmployeeDocBindings from "../../wailsjs/go/bindings/EmployeeDocumentBindings";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import { models } from "../../wailsjs/go/models";

type EmployeeDocument = models.EmployeeDocument;

interface EmployeeDocumentSearch {
  employee_id?: number;
}

export default function EmployeeDocumentList() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState<models.Employee | null>(null);

  useEffect(() => {
    if (employeeId) {
      EmployeeBindings.GetByID(Number(employeeId)).then(setEmployee);
    }
  }, [employeeId]);

  const fetchDocs = (criteria: EmployeeDocumentSearch) => {
    return EmployeeDocBindings.GetByEmployeeID(Number(employeeId));
  };

  const deleteDoc = async (doc: EmployeeDocument) => {
    await EmployeeDocBindings.Delete(doc.ID);
  };

  const handleDownload = async (docId: number) => {
    try {
      await EmployeeDocBindings.DownloadDocument(docId);
    } catch (err) {
      alert("Ошибка при скачивании: " + err);
    }
  };

  return (
    <div className="p-4">
      <nav className="text-sm text-gray-500 mb-2">
        <Link to="/employees" className="text-blue-500 hover:underline">Сотрудники</Link>
        {" / "}
        <span>{employee?.Name || "..."}</span>
      </nav>

      <ListPage<EmployeeDocument, EmployeeDocumentSearch>
        title="Документы сотрудника"
        headers={["Тип / Шаблон", "Дата создания", "Действия"]}
        fetchItems={fetchDocs}
        onDelete={deleteDoc}
        createLink={`/employees/${employeeId}/documents/edit/new`}
        initialSearchValue={{ employee_id: Number(employeeId) }}
        renderRow={(doc, idx, handleDelete) => (
          <tr key={doc.ID} className="border-t hover:bg-gray-50 transition-colors">
            <td className="p-2 w-12 text-center text-gray-400">{idx + 1}</td>
            <td className="p-2">
              <div className="font-medium text-gray-800">
                {doc.Template?.Name || `Документ #${doc.TemplateID}`}
              </div>
            </td>
            <td className="p-2 text-gray-600">
              {new Date(doc.CreatedAt).toLocaleDateString()}
            </td>
            <td className="p-2 w-32 text-right">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleDownload(doc.ID)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Скачать"
                >
                  ⬇️
                </button>
                {handleDelete && (
                  <button
                    onClick={() => handleDelete(doc)}
                    className="text-red-500 hover:text-red-700 transition-colors"
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
    </div>
  );
}