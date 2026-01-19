import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as ClientDocBindings from "../../wailsjs/go/bindings/ClientDocumentBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";

export default function ClientDocumentList() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<models.ClientDocument[]>([]);
  const [client, setClient] = useState<models.Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadData();
    }
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const id = Number(clientId);
      const [docs, c] = await Promise.all([
        ClientDocBindings.GetByClientID(id),
        ClientBindings.GetByID(id)
      ]);
      setDocuments(docs || []);
      setClient(c);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId: number) => {
    try {
      await ClientDocBindings.DownloadDocument(docId);
    } catch (err) {
      alert("Ошибка при скачивании: " + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить запись о документе клиента?")) return;
    try {
      await ClientDocBindings.Delete(id);
      loadData();
    } catch (err) {
      alert("Ошибка при удалении: " + err);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            <Link to="/clients" className="hover:underline text-blue-500">
              Клиенты
            </Link>
            / {client?.Name || "Загрузка..."}
          </nav>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">📁</span> Документы клиента
          </h1>
        </div>

        <button
          onClick={() => navigate(`/clients/${clientId}/documents/edit/new`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition"
        >
          + Создать документ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-xs uppercase text-gray-400 font-bold tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Тип / Шаблон</th>
              <th className="px-6 py-4">Дата создания</th>
              <th className="px-6 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  Документов клиента пока нет. Нажмите «Создать», чтобы сгенерировать первый файл.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.ID} className="hover:bg-blue-50/50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.ID}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {doc.Template?.Name || `Документ #${doc.TemplateID}`}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        ID: {doc.TemplateID}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(doc.CreatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleDownload(doc.ID)}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                      title="Скачать DOCX"
                    >
                      ⬇️ <span className="ml-1 text-xs font-bold">Скачать</span>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.ID)}
                      className="p-1 text-red-300 hover:text-red-500 transition-colors"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}