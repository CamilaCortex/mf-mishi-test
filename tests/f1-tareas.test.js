import test from "node:test";
import assert from "node:assert/strict";

import {
  addTask,
  toggleTask,
  removeTask,
  serializeTasks,
  parseTasks,
} from "../src/logic.js";

test("addTask agrega una tarea nueva a una lista vacía", () => {
  const result = addTask([], "Regar plantas", "a1");
  assert.deepEqual(result, [{ id: "a1", text: "Regar plantas", done: false }]);
});

test("addTask no agrega tareas con solo espacios", () => {
  const result = addTask([], "   ", "a2");
  assert.deepEqual(result, []);
});

test("addTask agrega al final, recorta el texto y no modifica la lista original", () => {
  const original = [{ id: "a1", text: "X", done: false }];
  const snapshot = structuredClone(original);

  const result = addTask(original, "  Y  ", "a2");

  assert.equal(result.length, 2);
  assert.equal(result[0].id, "a1");
  assert.equal(result[1].text, "Y");
  assert.equal(result[1].id, "a2");
  assert.equal(result[1].done, false);
  assert.deepEqual(original, snapshot);
});

test("toggleTask marca como hecha una tarea pendiente sin modificar la original", () => {
  const original = [{ id: "a1", text: "X", done: false }];
  const snapshot = structuredClone(original);

  const result = toggleTask(original, "a1");

  assert.deepEqual(result, [{ id: "a1", text: "X", done: true }]);
  assert.deepEqual(original, snapshot);
});

test("toggleTask desmarca una tarea hecha", () => {
  const result = toggleTask([{ id: "a1", text: "X", done: true }], "a1");
  assert.equal(result[0].done, false);
});

test("toggleTask con un id inexistente devuelve una lista igual a la original", () => {
  const original = [{ id: "a1", text: "X", done: false }];
  const snapshot = structuredClone(original);

  const result = toggleTask(original, "zzz");

  assert.deepEqual(result, original);
  assert.deepEqual(original, snapshot);
});

test("removeTask quita la tarea con ese id y no modifica la original", () => {
  const original = [
    { id: "a1", text: "X", done: false },
    { id: "a2", text: "Y", done: true },
  ];
  const snapshot = structuredClone(original);

  const result = removeTask(original, "a1");

  assert.deepEqual(result, [{ id: "a2", text: "Y", done: true }]);
  assert.deepEqual(original, snapshot);
});

test("parseTasks(serializeTasks(lista)) devuelve una lista igual a la original", () => {
  const lista = [
    { id: "a1", text: "Regar plantas", done: false },
    { id: "a2", text: "Comprar pan", done: true },
  ];
  const snapshot = structuredClone(lista);

  const restaurada = parseTasks(serializeTasks(lista));

  assert.deepEqual(restaurada, lista);
  assert.deepEqual(lista, snapshot);
});

test("parseTasks devuelve [] con texto que no es JSON", () => {
  assert.deepEqual(parseTasks("esto no es json"), []);
});

test("parseTasks devuelve [] si el texto es null", () => {
  assert.deepEqual(parseTasks(null), []);
});

test("parseTasks devuelve [] si el JSON no es una lista", () => {
  assert.deepEqual(parseTasks('{"a":1}'), []);
});
