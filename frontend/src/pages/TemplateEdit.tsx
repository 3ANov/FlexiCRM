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
    }),
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
    setTemplate(
      models.DocumentTemplate.createFrom({ ...template, ...newData }),
    );
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentTemplateBindings.PickAndScanTemplate();
      if (!result || !result.FilePath) return;

      const scannedFields = result.Keys.map((k: string) =>
        models.TemplateField.createFrom({
          key: k,
          label: k,
          type: "text",
          required: false,
        }),
      );

      setTemplate(
        models.DocumentTemplate.createFrom({
          ...template,
          FileName: result.FilePath,
          Fields: scannedFields,
        }),
      );
    } catch (err) {
      alert("Ошибка при выборе или сканировании файла: " + err);
    }
  };

  const addField = () => {
    const newField = models.TemplateField.createFrom({
      key: "",
      label: "",
      type: "text",
      required: false,
    });
    updateState({ Fields: [...(template.Fields || []), newField] });
  };

  const updateField = (index: number, data: Partial<models.TemplateField>) => {
    const newFields = [...(template.Fields || [])];
    newFields[index] = models.TemplateField.createFrom({
      ...newFields[index],
      ...data,
    });
    updateState({ Fields: newFields });
  };

  const removeField = (index: number) => {
    updateState({
      Fields: (template.Fields || []).filter((_, i) => i !== index),
    });
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-4 text-gray-800 transition-all">
      <div className="flex justify-between items-start mb-8 pb-5 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {template.ID ? "Настройка шаблона" : "Создание шаблона"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Загрузите .docx файл и укажите названия полей для автозаполнения
          </p>
        </div>
        <button
          onClick={() => navigate("/templates")}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
            Название шаблона в системе
          </label>
          <input
            className="w-full border border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
            value={template.Name}
            onChange={(e) => updateState({ Name: e.target.value })}
            placeholder="Напр: Трудовой договор (Стандарт)"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
            Файл шаблона (.docx)
          </label>
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl font-mono text-[11px] text-gray-500 outline-none truncate shadow-inner"
              value={
                template.FileName
                  ? template.FileName.split(/[\\/]/).pop()
                  : "Файл не выбран"
              }
              readOnly
            />
            <button
              onClick={handleSelectFile}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl transition-all shadow-md active:scale-95"
              title="Выбрать файл и сканировать теги"
            >
              📂
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-700 flex items-center">
            <span className="mr-2 opacity-50">📋</span> Переменные в документе
          </h3>
          <button
            onClick={addField}
            className="text-blue-600 hover:bg-blue-50 text-xs font-bold flex items-center px-3 py-1.5 rounded-lg border border-blue-200 transition-all active:scale-95"
          >
            + Добавить поле
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.1em] text-gray-400 bg-gray-50/80 border-b border-gray-100">
                <th className="p-4 font-bold">Тег в Word (Ключ)</th>
                <th className="p-4 font-bold">Отображаемое имя</th>
                <th className="p-4 font-bold">Тип данных</th>
                <th className="p-4 font-bold text-center w-24">Обязательно</th>
                <th className="p-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {template.Fields.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="text-gray-300 mb-2 text-3xl">📥</div>
                    <p className="text-gray-400 text-sm">
                      Выберите файл, чтобы извлечь переменные{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        {"{{...}}"}
                      </code>{" "}
                      автоматически
                    </p>
                  </td>
                </tr>
              ) : (
                template.Fields.map((field, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="p-3">
                      <div className="flex items-center text-blue-700 font-mono text-sm bg-gray-50 rounded-lg px-2 border border-transparent group-hover:border-blue-100 transition-all">
                        <span className="opacity-40 font-normal">{"{{"}</span>
                        <input
                          className="bg-transparent border-none outline-none py-1.5 px-1 w-full font-bold focus:ring-0"
                          value={field.key}
                          onChange={(e) =>
                            updateField(idx, { key: e.target.value })
                          }
                          placeholder="key"
                        />
                        <span className="opacity-40 font-normal">{"}}"}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        className="w-full bg-transparent border border-transparent focus:border-blue-200 focus:bg-white rounded-lg outline-none p-2 text-sm transition-all"
                        value={field.label}
                        onChange={(e) =>
                          updateField(idx, { label: e.target.value })
                        }
                        placeholder="Напр: ФИО сотрудника"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        className="bg-transparent border border-transparent focus:border-blue-200 focus:bg-white rounded-lg outline-none p-2 text-sm text-gray-600 cursor-pointer w-full transition-all"
                        value={field.type}
                        onChange={(e) =>
                          updateField(idx, { type: e.target.value })
                        }
                      >
                        <option value="text">Текст (строка)</option>
                        <option value="date">Дата</option>
                        <option value="number">Число</option>
                        <option value="textarea">Абзац (много строк)</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(idx, { required: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeField(idx)}
                        className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        title="Удалить переменную"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end items-center space-x-4">
        <button
          onClick={() => navigate("/templates")}
          className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
        >
          Отмена
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-[0.97] flex items-center justify-center min-w-[180px]"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Сохранение...
            </span>
          ) : (
            "СОХРАНИТЬ ШАБЛОН"
          )}
        </button>
      </div>
    </div>
  );
}
