import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as DocumentTemplateBindings from "../../wailsjs/go/bindings/DocumentTemplateBindings";
import { models } from "../../wailsjs/go/models";

export default function TemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [template, setTemplate] = useState<models.DocumentTemplate>(
    models.DocumentTemplate.createFrom({
      ID: 0,
      Name: "",
      FileName: "",
      Fields: [],
    })
  );

  useEffect(() => {
    if (id && id !== "new" && !isNaN(Number(id))) {
      DocumentTemplateBindings.GetByID(Number(id))
        .then((res) => {
          if (res) {
            if (!res.Fields) res.Fields = [];
            setTemplate(res);
          }
        })
        .catch(console.error);
    }
  }, [id]);

  const updateState = (newData: Partial<models.DocumentTemplate>) => {
    setTemplate(models.DocumentTemplate.createFrom({ ...template, ...newData }));
  };


  const handleSelectFile = async () => {
    try {
      const result = await DocumentTemplateBindings.PickAndScanTemplate();
      
      if (!result || !result.FilePath) return;

      const fileName = result.FilePath.split(/[\\/]/).pop() || "";

      const scannedFields = result.Keys.map((k: string) => 
        models.TemplateField.createFrom({
          key: k,
          label: k,
          type: "text",
          required: false
        })
      );

      setTemplate(models.DocumentTemplate.createFrom({
        ...template,
        FileName: result.FilePath,
        Fields: scannedFields
      }));

    } catch (err) {
      alert("Ошибка при выборе или сканировании файла: " + err);
    }
  };

  const addField = () => {
    const newField = models.TemplateField.createFrom({ key: "", label: "", type: "text", required: false });
    updateState({ Fields: [...(template.Fields || []), newField] });
  };

  const updateField = (index: number, data: Partial<models.TemplateField>) => {
    const newFields = [...(template.Fields || [])];
    newFields[index] = models.TemplateField.createFrom({ ...newFields[index], ...data });
    updateState({ Fields: newFields });
  };

  const removeField = (index: number) => {
    updateState({ Fields: (template.Fields || []).filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!template.Name || !template.FileName) {
      alert("Заполните название и выберите файл шаблона!");
      return;
    }
    setLoading(true);
    try {
      if (template.ID > 0) {
        await DocumentTemplateBindings.Update(template);
      } else {
        await DocumentTemplateBindings.Create(template);
      }
      navigate("/templates");
    } catch (err) {
      alert("Ошибка: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg border mt-4 text-gray-800">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {template.ID ? "Настройка шаблона" : "Новый шаблон"}
          </h2>
          <p className="text-gray-500 mt-1">Загрузите .docx и опишите переменные для автозаполнения</p>
        </div>
        <button onClick={() => navigate("/templates")} className="text-gray-400 hover:text-gray-600 transition">
          Закрыть ✖
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Название шаблона в CRM</label>
          <input 
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition"
            value={template.Name} 
            onChange={e => updateState({ Name: e.target.value })}
            placeholder="Напр: Трудовой договор (Стандарт)"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Файл документа</label>
          <div className="flex items-center space-x-2">
            <input 
              className="flex-1 bg-gray-50 border-2 border-gray-200 p-3 rounded-lg font-mono text-xs text-gray-500 outline-none"
              value={template.FileName || "Файл не выбран"} 
              readOnly
            />
            <button 
              onClick={handleSelectFile}
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg transition shadow-md"
              title="Выбрать файл и сканировать теги"
            >
              📂
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg flex items-center">
            <span className="mr-2">📋</span> Список переменных
          </h3>
          <button 
            onClick={addField}
            className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center border-2 border-blue-600 px-3 py-1 rounded-full transition"
          >
            + Добавить вручную
          </button>
        </div>
        
        <div className="min-h-[200px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 bg-gray-50">
                <th className="p-4">Тег в Word</th>
                <th className="p-4">Название в форме</th>
                <th className="p-4">Тип данных</th>
                <th className="p-4 text-center w-20">Обяз.</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {template.Fields.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <p className="text-lg">Пусто</p>
                    <p className="text-sm">Выберите файл, чтобы автоматически загрузить ключи из {"{{...}}"}</p>
                  </td>
                </tr>
              )}
              {template.Fields.map((field, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-3">
                    <div className="flex items-center text-indigo-600 font-mono font-bold">
                      <span className="opacity-30">{"{{"}</span>
                      <input 
                        className="bg-transparent border-b border-transparent focus:border-indigo-400 outline-none px-1 w-full" 
                        value={field.key} 
                        onChange={e => updateField(idx, {key: e.target.value})} 
                        placeholder="key"
                      />
                      <span className="opacity-30">{"}}"}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <input 
                      className="w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none p-1" 
                      value={field.label} 
                      onChange={e => updateField(idx, {label: e.target.value})} 
                      placeholder="Напр: Сумма оклада"
                    />
                  </td>
                  <td className="p-3">
                    <select 
                      className="bg-transparent outline-none text-gray-600 cursor-pointer w-full" 
                      value={field.type} 
                      onChange={e => updateField(idx, {type: e.target.value})}
                    >
                      <option value="text">Текст</option>
                      <option value="date">Дата</option>
                      <option value="number">Число</option>
                      <option value="textarea">Абзац</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox"
                      checked={field.required}
                      onChange={e => updateField(idx, {required: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => removeField(idx)} 
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t flex justify-end space-x-4">
        <button 
          onClick={() => navigate("/templates")} 
          className="px-8 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition"
        >
          Отмена
        </button>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-gray-300 transition-all active:scale-95"
        >
          {loading ? "Сохранение..." : "СОХРАНИТЬ ШАБЛОН"}
        </button>
      </div>
    </div>
  );
}