export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "number"
  | "checkbox"
  | "date"
  | "boolean";

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string | number; label: string }[];
}
