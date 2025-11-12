import React, { useState, useEffect } from 'react';
import CreateEditPage, { FieldConfig } from '../components/CreateEditPage';
import * as TaskBindings from '../../wailsjs/go/bindings/TaskBindings';
import * as EmployeeBindings from '../../wailsjs/go/bindings/EmployeeBindings';
import * as ProjectBindings from '../../wailsjs/go/bindings/ProjectBindings';
import { models } from '../../wailsjs/go/models';

type Task = models.Task;
type Employee = models.Employee;
type Project = models.Project;

const statusOptions = [
    { value: 'New', label: 'Новая' },
    { value: 'InProgress', label: 'В работе' },
    { value: 'Completed', label: 'Завершена' },
    { value: 'Canceled', label: 'Отменена' },
];

export default function TaskEdit() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            EmployeeBindings.GetAll(),
            ProjectBindings.GetAll()
        ])
        .then(([allEmployees, allProjects]) => {
            setEmployees(allEmployees);
            setProjects(allProjects);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Загрузка данных формы...</div>;
    
    const initialTask: Task = {
        ID: 0,
        Title: "",
        Description: "",
        AssignedTo: 0,
        ProjectID: 0,
        Status: "New",
        Deadline: new Date().toISOString(),
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
    } as Task;

    const taskFields: FieldConfig<Task>[] = [
        { name: 'Title', label: 'Название', type: 'text' },
        { name: 'Description', label: 'Описание', type: 'textarea' },
        { 
            name: 'AssignedTo', 
            label: 'Исполнитель', 
            type: 'select', 
            options: employees.map(e => ({ value: e.ID, label: e.Name })) 
        },
        { 
            name: 'ProjectID', 
            label: 'Проект', 
            type: 'select', 
            options: projects.map(p => ({ value: p.ID, label: p.Name })) 
        },
        { 
            name: 'Status', 
            label: 'Статус', 
            type: 'select', 
            options: statusOptions
        },
        { name: 'Deadline', label: 'Срок', type: 'date' },
    ];

    return (
        <CreateEditPage<Task>
            key={TaskBindings.GetByID.name}
            title="Управление задачей"
            listRoute="/tasks"
            
            fetchById={TaskBindings.GetByID}
            create={TaskBindings.Create}
            update={TaskBindings.Update}
            
            initialValue={initialTask}
            fields={taskFields}
        />
    );
}