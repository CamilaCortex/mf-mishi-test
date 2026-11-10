// Lógica PURA de la app: sin DOM, sin red, sin fechas implícitas.
// Cada función recibe datos y devuelve datos nuevos (nunca modifica sus argumentos).
// Así se puede probar con node:test (ver tests/).

export const APP_NAME = "Mishi Tareas";

/** Texto limpio: sin espacios sobrantes. Ejemplo de función pura. */
export function cleanText(text) {
  return String(text ?? "").trim().replace(/\s+/g, " ");
}

/** Nueva lista con la tarea al final. Si el texto queda vacío, devuelve una copia de la lista. */
export function addTask(tasks, text, id) {
  const clean = cleanText(text);
  if (clean === "") return tasks.map((t) => ({ ...t }));
  return [...tasks.map((t) => ({ ...t })), { id, text: clean, done: false }];
}

/** Nueva lista donde la tarea con ese id invierte su campo done. */
export function toggleTask(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : { ...t }));
}

/** Nueva lista sin la tarea con ese id. */
export function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id).map((t) => ({ ...t }));
}

/** Texto JSON listo para guardar. */
export function serializeTasks(tasks) {
  return JSON.stringify(
    tasks.map((t) => ({ id: t.id, text: t.text, done: t.done })),
  );
}

/** Ánimo del mishi según las tareas: 'sleeping' sin tareas, 'happy' si hay al menos la mitad hecha, 'bored' en otro caso. */
export function getMishiMood(tasks) {
  if (tasks.length === 0) return "sleeping";
  const done = tasks.filter((t) => t.done).length;
  if (done * 2 >= tasks.length) return "happy";
  return "bored";
}

/** Emoji del gato para cada ánimo. */
export function getMishiEmoji(mood) {
  if (mood === "happy") return "😺";
  if (mood === "bored") return "😿";
  return "😴";
}

/** Frase corta del mishi para cada ánimo. Ánimo desconocido: la de 'sleeping'. */
export function getMishiPhrase(mood) {
  if (mood === "happy") return "¡Qué bien vamos! Sigue así, miau.";
  if (mood === "bored") return "Miau… ¿y las demás tareas?";
  return "Zzz… agrega una tarea para despertarme.";
}

/** Cuántas tareas están hechas y cuántas hay en total. */
export function countProgress(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return { done, total };
}

/** Texto de progreso para mostrar arriba de la lista. */
export function getProgressText(tasks) {
  const { done, total } = countProgress(tasks);
  if (total === 0) return "Aún no tienes tareas: ¡agrega la primera!";
  return `Llevas ${done} de ${total} tareas`;
}

/** true solo si hay al menos una tarea y todas están hechas. */
export function isAllDone(tasks) {
  return tasks.length > 0 && tasks.every((t) => t.done);
}

/** Mensaje de celebración si todas las tareas están hechas; si no, ''. */
export function getCelebrationMessage(tasks) {
  if (!isAllDone(tasks)) return "";
  return "¡Lo lograste! Todas tus tareas están hechas 🎉";
}

function isValidTask(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.text === "string" &&
    typeof item.done === "boolean"
  );
}

/** Convierte texto guardado en lista de tareas válidas. Devuelve [] si algo no encaja. */
export function parseTasks(text) {
  if (typeof text !== "string") return [];
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data
    .filter(isValidTask)
    .map((t) => ({ id: t.id, text: t.text, done: t.done }));
}
