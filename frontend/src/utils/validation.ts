export type ValidationErrors = Record<string, string>;

export const validateObject = <T extends object>(
  obj: T,
  fields: any[]
): ValidationErrors => {
  const errors: ValidationErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  fields.forEach((f) => {
    const value = obj[f.name as keyof T];
    const stringValue = String(value ?? "").trim();


    if (f.type === "email" && stringValue !== "") {
      if (!emailRegex.test(stringValue)) {
        errors[f.name as string] = "Некорректный формат email";
      }
    }

    if (f.required && !stringValue) {
      errors[f.name as string] = "Это поле обязательно для заполнения";
    }
  });

  return errors;
};