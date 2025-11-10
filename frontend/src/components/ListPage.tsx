import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

interface ListPageProps<T> {
  title: string;
  fetchItems: (search: string) => Promise<T[]>;
  renderRow: (
    item: T,
    idx: number,
    handleDelete?: (item: T) => Promise<void>
  ) => React.ReactNode;
  createLink: string;
  headers: string[];
  onDelete?: (item: T) => Promise<void>;
}

export default function ListPage<T extends { ID?: number | string }>({
  title,
  fetchItems,
  renderRow,
  createLink,
  headers,
  onDelete,
}: ListPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await fetchItems(search);
      setItems(data);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    }
  }, [fetchItems, search]);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <Link
          to={createLink}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Создать
        </Link>
      </div>

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

      {items.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          {search ? "По вашему запросу ничего не найдено." : "Список пуст."}
        </div>
      )}
    </div>
  );
}
