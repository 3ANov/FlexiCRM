import React, { useState, useEffect, useCallback } from "react";
import { FieldConfig } from "./CreateEditPage";

interface SearchFormProps<T> {
  fields: FieldConfig<T>[];
  onSearch: (criteria: T) => void;
  initialValue: T;
}

const getSearchValue = (val: unknown) => {
  if (val === undefined || val === null) return "";
  if (val instanceof Date) return val.toISOString().substring(0, 10);
  if (typeof val === "string" && val.includes("T")) return val.substring(0, 10);

  return String(val);
};

export default function SearchForm<T extends object>({
  fields,
  onSearch,
  initialValue,
}: SearchFormProps<T>) {
  const [searchCriteria, setSearchCriteria] = useState<T>(initialValue);

  const handleChange = (
    field: keyof T,
    value: any,
    type: FieldConfig<T>["type"]
  ) => {
    let processedValue: any = value;

    if (type === "number" || type === "select") {
      if (value === "" || value === undefined) {
        processedValue = undefined;
      } else {
        processedValue = Number(value);
      }
    } else if (type === "date") {
      if (value) {
        processedValue = new Date(value).toISOString();
      } else {
        processedValue = undefined;
      }
    } else if (value === "") {
      processedValue = "";
    }

    setSearchCriteria((prev) => ({ ...prev, [field]: processedValue } as T));
  };

  const handleSearch = useCallback(() => {
    const finalCriteria = {} as T;
    for (const key in searchCriteria) {
      const val = searchCriteria[key];
      if (val !== undefined && val !== null && val !== "") {
        (finalCriteria as any)[key] = val;
      }
    }
    onSearch(finalCriteria);
  }, [searchCriteria, onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchCriteria, handleSearch]);

  return (
    <div className="p-4 bg-gray-50 border rounded-lg shadow-sm mb-4">
      <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        {fields.map((f) => {
          const currentValue = (searchCriteria as any)[f.name] || "";
          const displayValue = getSearchValue(currentValue);

          if (f.type === "select" && f.options) {
            return (
              <div key={String(f.name)}>
                <select
                  value={displayValue}
                  onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                  className="block w-full border p-2 text-sm rounded-md"
                >
                  <option value="">Все: {f.label}</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={String(f.name)}>
              <input
                type={f.type === "date" ? "date" : f.type}
                placeholder={f.label}
                value={displayValue}
                onChange={(e) => handleChange(f.name, e.target.value, f.type)}
                className="block w-full border p-2 text-sm rounded-md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
