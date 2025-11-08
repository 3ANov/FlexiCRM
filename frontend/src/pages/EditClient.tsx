import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as ClientBindings from '../../wailsjs/go/bindings/ClientBindings';
import { models } from '../../wailsjs/go/models';

export default function ClientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<models.Client>(new models.Client());

  useEffect(() => {
    if (id) {
      ClientBindings.GetByID(Number(id))
        .then((c) => setClient(new models.Client(c)))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (field: keyof models.Client, value: any) => {
    setClient(new models.Client({ ...client, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await ClientBindings.Update(client);
      } else {
        await ClientBindings.Create(client);
      }
      navigate('/clients');
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении клиента');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Редактировать клиента' : 'Новый клиент'}</h1>
      <div className="mb-4">
        <label className="block mb-1">Имя</label>
        <input
          type="text"
          value={client.Name || ''}
          onChange={(e) => handleChange('Name', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Телефон</label>
        <input
          type="text"
          value={client.Phone || ''}
          onChange={(e) => handleChange('Phone', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={client.Email || ''}
          onChange={(e) => handleChange('Email', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Описание</label>
        <textarea
          value={client.Description || ''}
          onChange={(e) => handleChange('Description', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Сохранить
      </button>
    </div>
  );
}
