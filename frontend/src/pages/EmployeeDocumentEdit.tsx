import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as TemplateBindings from "../../wailsjs/go/bindings/DocumentTemplateBindings";
import * as EmployeeDocBindings from "../../wailsjs/go/bindings/EmployeeDocumentBindings";
import * as EmployeeBindings from "../../wailsjs/go/bindings/EmployeeBindings";
import { models } from "../../wailsjs/go/models";

export default function EmployeeDocumentEdit() {
  const { employeeId, id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<models.Employee | null>(null);
  const [templates, setTemplates] = useState<models.DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<models.DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {

    EmployeeBindings.GetByID(Number(employeeId)).then(setEmployee).catch(console.error);
    

    TemplateBindings.GetAll().then(setTemplates).catch(console.error);


    if (id && id !== "new") {
      EmployeeDocBindings.GetByID(Number(id)).then(doc => {
        if (doc) {
          setFormData(doc.Data || {});
          TemplateBindings.GetByID(doc.TemplateID).then(setSelectedTemplate);
        }
      });
    }
  }, [employeeId, id]);

  const handleTemplateChange = (tmplId: number) => {
    const tmpl = templates.find(t => t.ID === tmplId);
    if (tmpl) {
      setSelectedTemplate(tmpl);

      const newData: Record<string, string> = {};
      tmpl.Fields.forEach(f => {
        if (f.key === "name" || f.key === "fio") newData[f.key] = employee?.Name || "";
        else if (f.key === "phone") newData[f.key] = employee?.Phone || "";
        else if (f.key === "role" || f.key === "position") newData[f.key] = employee?.Role || "";
        else newData[f.key] = formData[f.key] || ""; 
      });
      setFormData(newData);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return alert("Выберите шаблон");

    const doc = models.EmployeeDocument.createFrom({
      ID: id && id !== "new" ? Number(id) : 0,
      EmployeeID: Number(employeeId),
      TemplateID: selectedTemplate.ID,
      Data: formData
    });

    try {
      await EmployeeDocBindings.Save(doc);
      navigate(`/employees/${employeeId}/documents`);
    } catch (err) {
      alert("Ошибка сохранения: " + err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id === "new" ? "Новый документ" : "Редактирование документа"}
        </h1>
        <p className="text-gray-500">Для сотрудника: <span className="font-semibold">{employee?.Name}</span></p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Выберите шаблон документа
        </label>
        <select
          className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition mb-8"
          value={selectedTemplate?.ID || ""}
          onChange={(e) => handleTemplateChange(Number(e.target.value))}
          disabled={id !== "new"}
        >
          <option value="">-- Нажмите для выбора --</option>
          {templates.map(t => <option key={t.ID} value={t.ID}>{t.Name}</option>)}
        </select>

        {selectedTemplate && (
          <div className="space-y-5 animate-in fade-in duration-500">
            <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">Данные для заполнения шаблона:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplate.Fields.map(field => (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === "textarea" ? (
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                      rows={3}
                      value={formData[field.key] || ""}
                      onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                    />
                  ) : (
                    <input
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                      value={formData[field.key] || ""}
                      onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition"
              >
                💾 Сохранить документ
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}