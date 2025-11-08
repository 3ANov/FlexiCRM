import React from 'react';

const mockNotes = [
  { id: 1, text: 'Позвонить Иванову завтра' },
  { id: 2, text: 'Подготовить отчёт по сделке #2' },
];

export default function Notes() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Заметки</h1>
      <ul className="space-y-2">
        {mockNotes.map(n => (
          <li key={n.id} className="bg-white p-3 shadow rounded">
            {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
