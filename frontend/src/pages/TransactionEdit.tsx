import CreateEditPage, { FieldConfig } from '../components/CreateEditPage';
import * as TransactionBindings from '../../wailsjs/go/bindings/TransactionBindings';
import { models } from '../../wailsjs/go/models';

type Transaction = models.Transaction;

const typeOptions = [
    { value: 'Income', label: 'Доход' },
    { value: 'Expense', label: 'Расход' },
];

export default function TransactionEdit() {
    const initialTransaction: Transaction = {
        ID: 0,
        Type: "Income",
        Amount: 0,
        Category: "",
        Notes: "",
        Date: new Date().toISOString(),
    } as Transaction;

    const transactionFields: FieldConfig<Transaction>[] = [
        { 
            name: 'Type', 
            label: 'Тип', 
            type: 'select', 
            options: typeOptions 
        },
        { name: 'Amount', label: 'Сумма', type: 'number' },
        { name: 'Category', label: 'Категория', type: 'text' },
        { name: 'Notes', label: 'Заметки', type: 'textarea' },
        { name: 'Date', label: 'Дата', type: 'date' },
    ];

    return (
        <CreateEditPage<Transaction>
            key={TransactionBindings.GetByID.name}
            title="Управление транзакцией"
            listRoute="/transactions"
            
            fetchById={TransactionBindings.GetByID}
            create={TransactionBindings.Create}
            update={TransactionBindings.Update}
            
            initialValue={initialTransaction}
            fields={transactionFields}
        />
    );
}