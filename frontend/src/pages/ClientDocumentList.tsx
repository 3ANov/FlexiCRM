import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import * as ClientDocBindings from "../../wailsjs/go/bindings/ClientDocumentBindings";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";

type ClientDocument = models.ClientDocument;

interface ClientDocumentSearch {
  client_id?: number;
}

export default function ClientDocumentList() {
  const { clientId } = useParams();
  const [client, setClient] = useState<models.Client | null>(null);

  useEffect(() => {
    if (clientId) {
      ClientBindings.GetByID(Number(clientId)).then(setClient);
    }
  }, [clientId]);


  const fetchDocs = (criteria: ClientDocumentSearch) => {
    return ClientDocBindings.GetByClientID(Number(clientId));
  };

  const deleteDoc = async (doc: ClientDocument) => {
    await ClientDocBindings.Delete(doc.ID);
  };

  const handleDownload = async (docId: number) => {
    try {
      await ClientDocBindings.DownloadDocument(docId);
    } catch (err) {
      alert("Ошибка при скачивании: " + err);
    }
  };

  return (
    <div className="p-4">
      <nav className="text-sm text-gray-500 mb-2">
        <Link to="/clients" className="text-blue-500 hover:underline">Клиенты</Link>
        {" / "}
        <span>{client?.Name || "..."}</span>
      </nav>

      <ListPage<ClientDocument, ClientDocumentSearch>
        title="Документы клиента"
        headers={["Тип / Шаблон", "Дата создания", "Действия"]}
        fetchItems={fetchDocs}
        onDelete={deleteDoc}
        createLink={`/clients/${clientId}/documents/edit/new`}
        initialSearchValue={{ client_id: Number(clientId) }}
        renderRow={(doc, idx, handleDelete) => (
          <tr key={doc.ID} className="border-t hover:bg-gray-50 transition-colors">
            <td className="p-2 w-12 text-center text-gray-400">{idx + 1}</td>
            <td className="p-2">
              <div className="font-medium text-gray-800">
                {doc.Template?.Name || `Документ #${doc.TemplateID}`}
              </div>
            </td>
            <td className="p-2 text-gray-600">
              {new Date(doc.CreatedAt).toLocaleDateString()}
            </td>
            <td className="p-2 w-32 text-right">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleDownload(doc.ID)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Скачать"
                >
                  ⬇️
                </button>
                {handleDelete && (
                  <button
                    onClick={() => handleDelete(doc)}
                    className="text-red-500 hover:text-red-700"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}