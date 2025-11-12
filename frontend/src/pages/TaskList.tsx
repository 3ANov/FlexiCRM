import { Link } from 'react-router-dom';
import ListPage from '../components/ListPage';
import * as TaskBindings from '../../wailsjs/go/bindings/TaskBindings';
import { models } from '../../wailsjs/go/models';

type Task = models.Task;

export default function TaskList() {
    
    const fetchTasks = (search: string) => {
        return TaskBindings.GetAll(); 
    };
    
    const deleteTask = async (t: Task) => {
        await TaskBindings.Delete(t.ID); 
    };

    const formatDate = (isoDate: string | undefined): string => {
        if (!isoDate) return '';
        try {
            return new Date(isoDate).toLocaleDateString();
        } catch (error) {
            return '';
        }
    };

    return (
        <ListPage<Task>
            title="Задачи"
            headers={['Название', 'Исполнитель', 'Проект ID', 'Статус', 'Срок', 'Действия']}
            fetchItems={fetchTasks}
            createLink="/tasks/edit"
            onDelete={deleteTask}
            
            renderRow={(t, idx, handleDelete) => (
                <tr key={t.ID} className="border-t hover:bg-gray-50">
                    <td className="p-2 w-12 text-center">{idx + 1}</td>
                    <td className="p-2">{t.Title}</td>            
                    <td className="p-2 w-48">
                        {t.Employee ? t.Employee.Name : 'Не назначен'}
                    </td>
                    
                    <td className="p-2 w-24">{t.ProjectID || 'Нет'}</td>
                    <td className="p-2 w-32">{t.Status}</td>
                    <td className="p-2 w-32">{formatDate(t.Deadline)}</td>

                    <td className="p-2 w-32 text-right">
                        <div className="flex justify-end space-x-2">
                            <Link
                                to={`/tasks/edit/${t.ID}`}
                                className="text-blue-500 hover:text-blue-700"
                                title="Редактировать"
                            >
                                ✏️
                            </Link>
                            {handleDelete && (
                                <button
                                    onClick={() => handleDelete(t)}
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