// Conecta la lógica (src/logic.js) con la página. Aquí sí hay DOM y localStorage.
import {
  APP_NAME,
  addTask,
  toggleTask,
  removeTask,
  serializeTasks,
  parseTasks,
  getMishiMood,
  getMishiEmoji,
  getMishiPhrase,
  getProgressText,
  isAllDone,
  getCelebrationMessage,
} from "./logic.js";

const STORAGE_KEY = "mishi-tareas";

const app = document.getElementById("app");
app.dataset.ready = "true";
document.title = APP_NAME;

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const empty = document.getElementById("empty");
const mishiEmoji = document.getElementById("mishi-emoji");
const mishiPhrase = document.getElementById("mishi-phrase");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progress-text");
const celebration = document.getElementById("celebration");
const confetti = document.getElementById("confetti");

let tasks = loadTasks();
render();

function loadTasks() {
  try {
    return parseTasks(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, serializeTasks(tasks));
  } catch {
    // Sin localStorage la app sigue funcionando en memoria.
  }
}

function newId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function buildItem(task) {
  const li = document.createElement("li");
  li.className = "task" + (task.done ? " done" : "");

  const label = document.createElement("label");
  label.className = "task-check";

  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = task.done;
  box.dataset.id = task.id;

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  label.append(box, text);

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete";
  del.dataset.action = "delete";
  del.dataset.id = task.id;
  del.textContent = "🗑️";
  del.setAttribute("aria-label", `Borrar tarea: ${task.text}`);

  li.append(label, del);
  return li;
}

function render() {
  list.replaceChildren(...tasks.map(buildItem));
  empty.hidden = tasks.length > 0;
  renderMishi();
}

function renderMishi() {
  const mood = getMishiMood(tasks);
  mishiEmoji.textContent = getMishiEmoji(mood);
  mishiPhrase.textContent = getMishiPhrase(mood);
  mishiEmoji.dataset.mood = mood;
  renderProgress();
}

function renderProgress() {
  progressText.textContent = getProgressText(tasks);
  const celebrating = isAllDone(tasks);
  progress.classList.toggle("celebrating", celebrating);
  celebration.hidden = !celebrating;
  celebration.textContent = getCelebrationMessage(tasks);
  renderConfetti(celebrating);
}

function renderConfetti(on) {
  if (!on) {
    confetti.replaceChildren();
    return;
  }
  if (confetti.childElementCount > 0) return;
  const emojis = ["🎉", "🎊", "✨", "🥳", "🎈"];
  const pieces = Array.from({ length: 18 }, (_, i) => {
    const piece = document.createElement("span");
    piece.textContent = emojis[i % emojis.length];
    piece.style.left = `${(i * 37) % 100}%`;
    piece.style.animationDelay = `${(i % 6) * 0.15}s`;
    return piece;
  });
  confetti.append(...pieces);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const next = addTask(tasks, input.value, newId());
  if (next.length !== tasks.length) {
    tasks = next;
    save();
    render();
  }
  input.value = "";
  input.focus();
});

list.addEventListener("change", (event) => {
  const box = event.target;
  if (!(box instanceof HTMLInputElement) || box.type !== "checkbox") return;
  tasks = toggleTask(tasks, box.dataset.id);
  box.closest("li").classList.toggle("done", box.checked);
  save();
  renderMishi();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='delete']");
  if (!button) return;
  tasks = removeTask(tasks, button.dataset.id);
  save();
  render();
  input.focus();
});
