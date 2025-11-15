import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";
import { FieldConfig } from "./CreateEditPage";

interface ListPageProps<T, S> {
  title: string;

  fetchItems: (searchCriteria: S) => Promise<T[]>;
  renderRow: (
    item: T,
    idx: number,
    handleDelete?: (item: T) => Promise<void>
  ) => React.ReactNode;
  createLink: string;
  headers: string[];
  onDelete?: (item: T) => Promise<void>;

  searchFields?: FieldConfig<S>[];
  initialSearchValue?: S;
}

export default function ListPage<
  T extends { ID?: number | string },
  S extends object
>({
  title,
  fetchItems,
  renderRow,
  createLink,
  headers,
  onDelete,
  searchFields,
  initialSearchValue,
}: ListPageProps<T, S>) {
  const [searchCriteria, setSearchCriteria] = useState<S>(
    initialSearchValue || ({} as S)
  );
  const [items, setItems] = useState<T[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await fetchItems(searchCriteria);
      setItems(data);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    }
  }, [fetchItems, searchCriteria]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item: T) => {
    if (onDelete) {
      try {
        if (window.confirm(`Вы уверены, что хотите удалить элемент?`)) {
          await onDelete(item);
          await load();
        }
      } catch (err) {
        console.error("Ошибка удаления данных:", err);
        alert("Ошибка при удалении данных.");
      }
    }
  };

  const handleSearch = (criteria: S) => {
    setSearchCriteria(criteria);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {searchFields && (
        <SearchForm<S>
          fields={searchFields}
          initialValue={initialSearchValue || ({} as S)}
          onSearch={handleSearch}
        />
      )}

      <div className="p-4 bg-gray-50 border rounded-lg shadow-sm mb-4">
        <div className="flex justify-end mb-4">
          <Link
            to={createLink}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md whitespace-nowrap"
          >
            + Создать
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 w-12 text-center">№</th>
                  {headers.map((h) => (
                    <th key={h} className="p-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <React.Fragment key={item.ID || idx}>
                    {renderRow(item, idx, onDelete ? handleDelete : undefined)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            По вашему запросу ничего не найдено.
          </div>
        )}
      </div>
    </div>
  );
}
