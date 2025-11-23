import {
  ProjectStatuses,
  ProjectStatusLabels,
  TaskStatuses,
  TaskStatusLabels,
  TransactionStatuses,
  TransactionStatusLabels,
} from "../constants/statuses";


export type StatusType = "project" | "task" | "transaction";

export function getStatusLabel(
  status: string | undefined,
  type: StatusType
): string {
  if (!status) return "Неизвестно";

  switch (type) {
    case "project":
      return ProjectStatusLabels[status as keyof typeof ProjectStatusLabels] || status;
    case "task":
      return TaskStatusLabels[status as keyof typeof TaskStatusLabels] || status;
    case "transaction":
      return TransactionStatusLabels[status as keyof typeof TransactionStatusLabels] || status;
    default:
      return status;
  }
}

export function getStatusOptions(type: StatusType) {
  switch (type) {
    case "project":
      return Object.values(ProjectStatuses).map((value) => ({
        value,
        label: ProjectStatusLabels[value],
      }));
    case "task":
      return Object.values(TaskStatuses).map((value) => ({
        value,
        label: TaskStatusLabels[value],
      }));
    case "transaction":
      return Object.values(TransactionStatuses).map((value) => ({
        value,
        label: TransactionStatusLabels[value],
      }));
    default:
      return [];
  }
}
