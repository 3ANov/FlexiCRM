import React from "react";
import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import * as DocumentTemplateBindings from "../../wailsjs/go/bindings/DocumentTemplateBindings";
import { models } from "../../wailsjs/go/models";

type Template = models.DocumentTemplate;

export default function TemplateList() {
  const fetchTemplates = () => DocumentTemplateBindings.GetAll();
  const deleteTemplate = (t: Template) => DocumentTemplateBindings.Delete(t.ID);

  return (
    <ListPage<Template, any>
      title="Шаблоны документов (.docx)"
      headers={["Название", "Имя файла", "Полей", "Действия"]}
      fetchItems={fetchTemplates}
      createLink="/templates/edit"
      onDelete={deleteTemplate}
      initialSearchValue={{}}
      renderRow={(t, idx, handleDelete) => (
        <tr key={t.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center text-gray-400">{idx + 1}</td>
          <td className="p-2">{t.Name}</td>
          <td className="p-2 text-gray-600 font-mono text-sm">{t.FileName}</td>
          <td className="p-2 text-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {t.Fields?.length || 0}
            </span>
          </td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-3">
              <Link
                to={`/templates/edit/${t.ID}`}
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