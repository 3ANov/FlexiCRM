import React from 'react';

const mockDeals = [
  { id: 1, title: 'Сделка с ООО Ромашка', amount: '50 000 ₽', status: 'В процессе' },
  { id: 2, title: 'Продажа ИП Иванову', amount: '120 000 ₽', status: 'Завершена' },
];

export default function Deals() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Сделки</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Название</th>
            <th className="p-2">Сумма</th>
            <th className="p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {mockDeals.map(d => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.id}</td>
              <td className="p-2">{d.title}</td>
              <td className="p-2">{d.amount}</td>
              <td className="p-2">{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
