import React from "react";
import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../types/forms";
import * as DocumentTemplateBindings from "../../wailsjs/go/bindings/DocumentTemplateBindings";
import { models } from "../../wailsjs/go/models";

type Template = models.DocumentTemplate;

type TemplateSearch = models.DocumentTemplateSearch;

export default function TemplateList() {
  const fetchTemplates = (criteria: TemplateSearch) => {
    return DocumentTemplateBindings.Search(criteria);
  };

  const deleteTemplate = async (t: Template) => {
    await DocumentTemplateBindings.Delete(t.ID);
  };

  const templateSearchFields: FieldConfig<TemplateSearch>[] = [
    { name: "query", label: "Поиск по названию", type: "text" },
  ];

  const initialSearch: TemplateSearch = {
    query: "",
  };

  return (
    <ListPage<Template, TemplateSearch>
      title="Шаблоны документов (.docx)"
      headers={["Название", "Имя файла", "Полей", "Действия"]}
      fetchItems={fetchTemplates}
      createLink="/templates/edit"
      onDelete={deleteTemplate}
      searchFields={templateSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(t, idx, handleDelete) => (
        <tr key={t.ID} className="border-t hover:bg-gray-50 transition-colors">
          <td className="p-2 w-12 text-center text-gray-400">{idx + 1}</td>

          <td className="p-2">{t.Name}</td>
          <td className="p-2 text-gray-600 font-mono text-sm">{t.FileName}</td>

          <td className="p-2 w-32 text-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {t.Fields?.length || 0} шт.
            </span>
          </td>
          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/templates/edit/${t.ID}`}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Редактировать"
              >
                ✏️
              </Link>
              {handleDelete && (
                <button
                  onClick={() => handleDelete(t)}
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
  );
}
