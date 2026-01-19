import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as TemplateBindings from "../../wailsjs/go/bindings/DocumentTemplateBindings";
import * as ClientDocBindings from "../../wailsjs/go/bindings/ClientDocumentBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";

export default function ClientDocumentEdit() {
  const { clientId, id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState<models.Client | null>(null);
  const [templates, setTemplates] = useState<models.DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<models.DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {

    ClientBindings.GetByID(Number(clientId)).then(setClient).catch(console.error);
    

    TemplateBindings.GetAll().then(setTemplates).catch(console.error);


    if (id && id !== "new") {
      ClientDocBindings.GetByID(Number(id)).then(doc => {
        if (doc) {

          const existingData = doc.Data || (doc as any).BaseDocument?.Data;
          setFormData(existingData || {});
          
          const tId = doc.TemplateID || (doc as any).BaseDocument?.TemplateID;
          if (tId) TemplateBindings.GetByID(tId).then(setSelectedTemplate);
        }
      });
    }
  }, [clientId, id]);

  const handleTemplateChange = (tmplId: number) => {
    const tmpl = templates.find(t => t.ID === tmplId);
    if (tmpl) {
      setSelectedTemplate(tmpl);

      const newData: Record<string, string> = {};
      tmpl.Fields.forEach(f => {
        const key = f.key.toLowerCase();
        if (key === "client_name" || key === "fio" || key === "name") {
          newData[f.key] = client?.Name || "";
        } else if (key === "phone") {
          newData[f.key] = client?.Phone || "";
        } else if (key === "email") {
          newData[f.key] = client?.Email || "";
        } else {
          newData[f.key] = formData[f.key] || "";
        }
      });
      setFormData(newData);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return alert("Выберите шаблон");

    const doc = {
      ClientID: Number(clientId),
      ID: id && id !== "new" ? Number(id) : 0,
      TemplateID: selectedTemplate.ID,
      Data: formData,
    };

    try {
      if (doc.ID > 0) {
        await ClientDocBindings.Update(doc as any);
      } else {
        await ClientDocBindings.Create(doc as any);
      }
      navigate(`/clients/${clientId}/documents`);
    } catch (err) {
      alert("Ошибка сохранения: " + err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Оформление документа</h2>
          <p className="opacity-90">Клиент: {client?.Name}</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Тип документа</label>
            <select
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none transition"
              value={selectedTemplate?.ID || ""}
              onChange={(e) => handleTemplateChange(Number(e.target.value))}
            >
              <option value="">Выберите шаблон из списка...</option>
              {templates.map(t => <option key={t.ID} value={t.ID}>{t.Name}</option>)}
            </select>
          </div>

          {selectedTemplate && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTemplate.Fields.map(field => (
                  <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition"
                        rows={3}
                        value={formData[field.key] || ""}
                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                      />
                    ) : (
                      <input
                        type={field.type === "date" ? "date" : "text"}
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition"
                        value={formData[field.key] || ""}
                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  💾 Сохранить и закрыть
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}