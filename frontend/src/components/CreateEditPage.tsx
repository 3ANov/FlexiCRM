import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const getValue = (val: unknown) => {
    if (val === undefined || val === null) return "";
    if (val === 0) return "";
    if (val instanceof Date) return val.toISOString().substring(0, 10);
    if (typeof val === "string" && val.includes("T")) return val.substring(0, 10);
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
  }, [id, fetchById, initialValue, isEditing]);

  const handleChange = (field: keyof T, value: any, type: FieldConfig<T>["type"]) => {
    let processedValue: any = value;

    const fieldConfig = fields.find(f => f.name === field);
    const isNumericSelect =
      type === "select" &&
      fieldConfig?.options?.every(
        o => typeof o.value === "number" || (typeof o.value === "string" && !isNaN(Number(o.value)) && o.value !== "")
      );

    if (type === "number" || isNumericSelect) {
      if (value === "" || value === undefined || value === null) {
        processedValue = 0;
      } else {
        processedValue = Number(value);
      }
    } else if (type === "checkbox") {
      processedValue = (value as HTMLInputElement).checked;
    }

    setObj((prev) => ({ ...prev, [field]: processedValue } as T));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) await update(obj);
      else await create(obj);
      navigate(listRoute);
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении данных");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {title} ({isEditing ? "Редактирование" : "Создание"})
      </h1>

      {fields.map((f) => {
        const currentValue = (obj as any)[f.name];
        const displayValue = getValue(currentValue);

        return (
          <div
            key={String(f.name)}
            className={`mb-4 ${f.type === "checkbox" ? "flex items-center" : ""}`}
          >
            {f.type !== "checkbox" && <label className="block mb-1">{f.label}</label>}

            {f.type === "textarea" ? (
              <textarea
                value={displayValue}
                onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                className="w-full border p-2 rounded"
              />
            ) : f.type === "select" || f.type === "boolean" ? (
              <select
                value={displayValue}
                onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                className="w-full border p-2 rounded"
              >
                <option value="" className="text-gray-400" disabled>
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
                  checked={!!currentValue}
                  onChange={(e) => handleChange(f.name, e.target, f.type)}
                  className="mr-2"
                />
                <label>{f.label}</label>
              </>
            ) : (
              <input
                type={f.type}
                value={getValue(currentValue)}
                onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                className="w-full border p-2 rounded"
              />
            )}
          </div>
        );
      })}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Сохранить
      </button>
    </div>
  );
}
