// Lógica PURA de la app: sin DOM, sin red, sin fechas implícitas.
// Cada función recibe datos y devuelve datos nuevos (nunca modifica sus argumentos).
// Así se puede probar con node:test (ver tests/).

export const APP_NAME = "Mishi Tareas";

/** Texto limpio: sin espacios sobrantes. Ejemplo de función pura. */
export function cleanText(text) {
  return String(text ?? "").trim().replace(/\s+/g, " ");
}
