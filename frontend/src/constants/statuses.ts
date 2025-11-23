export const ProjectStatuses = {
  New: "New",
  InProgress: "InProgress",
  Completed: "Completed",
} as const;

export const ProjectStatusLabels: Record<typeof ProjectStatuses[keyof typeof ProjectStatuses], string> = {
  [ProjectStatuses.New]: "Новый",
  [ProjectStatuses.InProgress]: "В работе",
  [ProjectStatuses.Completed]: "Завершён",
};

export const TaskStatuses = {
  New: "New",
  InProgress: "InProgress",
  Completed: "Completed",
  Canceled: "Canceled",
} as const;

export const TaskStatusLabels: Record<typeof TaskStatuses[keyof typeof TaskStatuses], string> = {
  [TaskStatuses.New]: "Новая",
  [TaskStatuses.InProgress]: "В работе",
  [TaskStatuses.Completed]: "Выполнена",
  [TaskStatuses.Canceled]: "Отменена",
};

export const TransactionStatuses = {
  Income: "Income",
  Expense: "Expense",
} as const;

export const TransactionStatusLabels: Record<typeof TransactionStatuses[keyof typeof TransactionStatuses], string> = {
  [TransactionStatuses.Income]: "Доход",
  [TransactionStatuses.Expense]: "Расход",
};
