import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateObject, ValidationErrors } from "../utils/validation";
import { FieldConfig } from "../types/forms";

interface CreateEditPageProps<T> {
  title: string;
  fetchById: (id: number) => Promise<T>;
  create: (obj: T) => Promise<void>;
  update: (obj: T) => Promise<void>;
  fields: FieldConfig<T>[];
  initialValue: T;
  listRoute: string;
}

export default function CreateEditPage<T extends object>({
  title,
  fetchById,
  create,
  update,
  fields,
  initialValue,
  listRoute,
}: CreateEditPageProps<T>) {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [obj, setObj] = useState<T>(initialValue);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const getValue = (val: unknown, type: string) => {
    if (val === undefined || val === null || val === 0) return "";

    if (type === "date" || type === "datetime-local") {
      const date = new Date(val as string | Date);
      if (isNaN(date.getTime())) return "";

      const localISO = date.toLocaleString("sv-SE").replace(" ", "T");

      if (type === "datetime-local") return localISO.substring(0, 16);
      return localISO.substring(0, 10);
    }

    return String(val);
  };

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchById(Number(id))
        .then((data) => setObj(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setObj(initialValue);
    }
  }, [id, isEditing]);

  const handleChange = (field: keyof T, value: any, type: string) => {
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field as string];
        return newErrs;
      });
    }

    let processedValue: any = value;

    if (type === "number") {
      processedValue = value === "" ? 0 : Number(value);
    } else if (type === "select") {
      const num = Number(value);
      processedValue = value !== "" && !isNaN(num) ? num : value;
    } else if (type === "checkbox") {
      processedValue = Boolean(value);
    }

    setObj((prev) => ({ ...prev, [field]: processedValue }) as T);
  };

  const handleSubmit = async () => {
    const validationErrors = validateObject(obj, fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSend = { ...obj };

    fields.forEach((f) => {
      const value = (dataToSend as any)[f.name];
      if ((f.type === "date" || f.type === "datetime-local") && value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          (dataToSend as any)[f.name] = date;
        }
      }
    });

    try {
      if (isEditing) await update(dataToSend);
      else await create(dataToSend);
      navigate(listRoute);
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения");
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {title}{" "}
        <span className="text-sm font-normal text-gray-500">
          ({isEditing ? "Редактирование" : "Создание"})
        </span>
      </h1>

      {fields.map((f) => {
        const currentValue = (obj as any)[f.name];
        const displayValue = getValue(currentValue, f.type);
        const fieldError = errors[f.name as string];

        return (
          <div key={String(f.name)} className="mb-5">
            {f.type !== "checkbox" && (
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                {f.label}{" "}
                {f.required && <span className="text-red-500">*</span>}
              </label>
            )}

            <div className={f.type === "checkbox" ? "flex items-center" : ""}>
              {f.type === "textarea" ? (
                <textarea
                  value={displayValue}
                  onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                  className={`w-full border p-2 rounded-md outline-none transition-all ${
                    fieldError
                      ? "border-red-500 ring-1 ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                  rows={4}
                />
              ) : f.type === "select" ? (
                <select
                  value={displayValue}
                  onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                  className={`w-full border p-2 rounded-md outline-none ${
                    fieldError
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="" disabled>
                    Выберите {f.label.toLowerCase()}
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "checkbox" ? (
                <>
                  <input
                    type="checkbox"
                    id={String(f.name)}
                    checked={!!currentValue}
                    onChange={(e) =>
                      handleChange(f.name, e.target.checked, f.type)
                    }
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={String(f.name)}
                    className="text-sm text-gray-700"
                  >
                    {f.label}
                  </label>
                </>
              ) : (
                <input
                  type={f.type}
                  value={displayValue}
                  onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                  className={`w-full border p-2 rounded-md outline-none transition-all ${
                    fieldError
                      ? "border-red-500 ring-1 ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
              )}
            </div>

            {fieldError && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {fieldError}
              </p>
            )}
          </div>
        );
      })}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate(listRoute)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md transition-all active:scale-[0.98]"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
