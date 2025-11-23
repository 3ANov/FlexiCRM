export type FieldType =
  | "text"
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
  options?: { value: string | number; label: string }[];
}
