import { Link } from "react-router-dom";
import ListPage from "../components/ListPage";
import * as TransactionBindings from "../../wailsjs/go/bindings/TransactionBindings";
import { models } from "../../wailsjs/go/models";

type Transaction = models.Transaction;

export default function TransactionList() {
  const fetchTransactions = (search: string) => {
    return search
      ? TransactionBindings.Search(search)
      : TransactionBindings.GetAll();
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

  return (
    <ListPage<Transaction>
      title="Транзакции"
      headers={["№", "Тип", "Сумма", "Категория", "Дата", "Действия"]}
      fetchItems={fetchTransactions}
      createLink="/transactions/edit"
      onDelete={deleteTransaction}
      renderRow={(tx, idx, handleDelete) => (
        <tr key={tx.ID} className="border-t hover:bg-gray-50">
          <td className="p-2 w-12 text-center">{idx + 1}</td>
          <td className="p-2 w-24">{tx.Type}</td>
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
