import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import { FieldConfig } from "../types/forms";
import * as TransactionBindings from "../../wailsjs/go/bindings/TransactionBindings";
import { models } from "../../wailsjs/go/models";
import { getStatusOptions, getStatusLabel } from "../utils/statuses";

type Transaction = models.Transaction;
type TransactionSearch = models.TransactionSearch;

export default function TransactionList() {

  const typeOptions = getStatusOptions("transaction");

  const fetchTransactions = (criteria: TransactionSearch) => {
    return TransactionBindings.Search(criteria);
  };

  const deleteTransaction = async (tx: Transaction) => {
    await TransactionBindings.Delete(tx.ID);
  };

  const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    try {
      return new Date(isoDate).toLocaleDateString();
    } catch (e) {
      return isoDate;
    }
  };

  const transactionSearchFields: FieldConfig<TransactionSearch>[] = [
    { name: "query", label: "Поиск", type: "text" },
    { name: "type", label: "Тип", type: "select", options: typeOptions },
    { name: "category", label: "Категория", type: "text" },
    { name: "date_from", label: "Дата с", type: "datetime-local" },
    { name: "date_to", label: "Дата по", type: "datetime-local" },
    { name: "min_amount", label: "Мин. сумма", type: "number" },
    { name: "max_amount", label: "Макс. сумма", type: "number" },
  ];
    const initialSearch: TransactionSearch = {
    query: undefined,
    type: undefined,
    category: undefined,
    date_from: undefined,
    date_to: undefined,
    min_amount: undefined,
    max_amount: undefined,
  } as TransactionSearch;

  return (
    <ListPage<Transaction, TransactionSearch>
      title="Транзакции"
      headers={["Тип", "Сумма", "Категория", "Дата", "Действия"]}
      fetchItems={fetchTransactions}
      createLink="/transactions/edit"
      onDelete={deleteTransaction}
      searchFields={transactionSearchFields}
      initialSearchValue={initialSearch}
      renderRow={(tx, idx, handleDelete) => (
        <tr key={tx.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2 w-24">{getStatusLabel(tx.Type, "transaction")}</td>
          <td className="p-2 w-32">{tx.Amount}</td>
          <td className="p-2 w-32">{tx.Category}</td>
          <td className="p-2 w-32">{formatDate(tx.Date)}</td>

          <td className="p-2 w-32 text-right">
            <div className="flex justify-end space-x-2">
              <Link
                to={`/transactions/edit/${tx.ID}`}
                className="text-blue-500 hover:text-blue-700"
                title="Редактировать"
              >
                ✏️
              </Link>
              {handleDelete && (
                <button
                  onClick={() => handleDelete(tx)}
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
  );
}
