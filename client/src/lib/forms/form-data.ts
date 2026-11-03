export function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export function copyFileField(formData: FormData, name: string): FormData {
  const copy = new FormData();
  const file = formData.get(name);
  if (file instanceof File) {
    copy.set(name, file, file.name);
  }
  return copy;
}
