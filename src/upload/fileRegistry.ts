const files = new Map<string, File | Blob>();

export function registerFile(id: string, file: File | Blob) {
  files.set(id, file);
}

export function takeFile(id: string): File | Blob | undefined {
  const f = files.get(id);
  files.delete(id);
  return f;
}
