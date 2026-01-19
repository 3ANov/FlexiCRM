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
  const [loading, setLoading] = useState(false);

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
        const key = f.key.toLowerCase();
        if (key === "name" || key === "fio") {
          newData[f.key] = employee?.Name || "";
        } else if (key === "phone") {
          newData[f.key] = employee?.Phone || "";
        } else if (key === "role" || key === "position") {
          newData[f.key] = employee?.Role || "";
        } else {
          newData[f.key] = formData[f.key] || ""; 
        }
      });
      setFormData(newData);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return alert("Выберите шаблон");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {id === "new" ? "Создание документа" : "Редактирование документа"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Сотрудник: <span className="font-semibold text-blue-600">{employee?.Name}</span>
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        </div>

        <div className="p-8">
          <div className="mb-10 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
            <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 ml-1">
              Тип кадрового документа
            </label>
            <select
              className="w-full bg-white border border-blue-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-gray-700"
              value={selectedTemplate?.ID || ""}
              onChange={(e) => handleTemplateChange(Number(e.target.value))}
              disabled={id !== "new"}
            >
              <option value="">— Выберите шаблон из базы —</option>
              {templates.map(t => <option key={t.ID} value={t.ID}>{t.Name}</option>)}
            </select>
          </div>

          {selectedTemplate ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center space-x-2 border-b pb-2 border-gray-100">
                <span className="text-lg">📝</span>
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Параметры документа</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {selectedTemplate.Fields.map(field => (
                  <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full border border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none bg-gray-50/30"
                        rows={4}
                        value={formData[field.key] || ""}
                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                        placeholder="Введите текст..."
                      />
                    ) : (
                      <input
                        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                        className="w-full border border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/30"
                        value={formData[field.key] || ""}
                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-10 flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-gray-300 uppercase tracking-wider"
                >
                  {loading ? "Сохранение..." : "💾 Сформировать документ"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-2xl transition-all">
              <div className="text-5xl mb-4 opacity-30">📂</div>
              <p className="text-gray-400 font-medium">Для начала работы выберите шаблон документа</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}