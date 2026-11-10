import test from "node:test";
import assert from "node:assert/strict";

import {
  countProgress,
  getProgressText,
  isAllDone,
  getCelebrationMessage,
} from "../src/logic.js";

test("countProgress([]) devuelve {done:0, total:0}", () => {
  assert.deepEqual(countProgress([]), { done: 0, total: 0 });
});

test("countProgress cuenta las tareas hechas y el total", () => {
  const tasks = [
    { id: "1", text: "a", done: true },
    { id: "2", text: "b", done: false },
  ];
  const snapshot = structuredClone(tasks);

  assert.deepEqual(countProgress(tasks), { done: 1, total: 2 });
  assert.deepEqual(tasks, snapshot);
});

test("getProgressText devuelve 'Llevas 1 de 3 tareas' con los números reales", () => {
  const tasks = [
    { id: "1", text: "a", done: true },
    { id: "2", text: "b", done: false },
    { id: "3", text: "c", done: false },
  ];
  const snapshot = structuredClone(tasks);

  assert.equal(getProgressText(tasks), "Llevas 1 de 3 tareas");
  assert.deepEqual(tasks, snapshot);
});

test("getProgressText([]) devuelve 'Aún no tienes tareas: ¡agrega la primera!'", () => {
  assert.equal(
    getProgressText([]),
    "Aún no tienes tareas: ¡agrega la primera!",
  );
});

test("isAllDone([]) devuelve false", () => {
  assert.equal(isAllDone([]), false);
});

test("isAllDone devuelve true cuando todas las tareas están hechas", () => {
  const tasks = [
    { id: "1", text: "a", done: true },
    { id: "2", text: "b", done: true },
  ];
  const snapshot = structuredClone(tasks);

  assert.equal(isAllDone(tasks), true);
  assert.deepEqual(tasks, snapshot);
});

test("isAllDone devuelve false si queda alguna tarea pendiente", () => {
  const tasks = [
    { id: "1", text: "a", done: true },
    { id: "2", text: "b", done: false },
  ];
  const snapshot = structuredClone(tasks);

  assert.equal(isAllDone(tasks), false);
  assert.deepEqual(tasks, snapshot);
});

test("getCelebrationMessage devuelve un texto no vacío cuando todas están hechas", () => {
  const tasks = [{ id: "1", text: "a", done: true }];
  const snapshot = structuredClone(tasks);

  const message = getCelebrationMessage(tasks);

  assert.equal(typeof message, "string");
  assert.notEqual(message.trim(), "");
  assert.deepEqual(tasks, snapshot);
});

test("getCelebrationMessage devuelve '' si hay tareas pendientes", () => {
  const tasks = [{ id: "1", text: "a", done: false }];
  const snapshot = structuredClone(tasks);

  assert.equal(getCelebrationMessage(tasks), "");
  assert.deepEqual(tasks, snapshot);
});

test("getCelebrationMessage([]) devuelve ''", () => {
  assert.equal(getCelebrationMessage([]), "");
});
