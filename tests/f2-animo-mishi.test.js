import test from "node:test";
import assert from "node:assert/strict";

import {
  getMishiMood,
  getMishiEmoji,
  getMishiPhrase,
} from "../src/logic.js";

test("getMishiMood([]) devuelve 'sleeping' cuando no hay tareas", () => {
  assert.equal(getMishiMood([]), "sleeping");
});

test("getMishiMood con una tarea pendiente devuelve 'bored'", () => {
  const tasks = [{ id: "1", text: "a", done: false }];
  const snapshot = structuredClone(tasks);

  assert.equal(getMishiMood(tasks), "bored");
  assert.deepEqual(tasks, snapshot);
});

test("getMishiMood con exactamente la mitad hecha devuelve 'happy'", () => {
  const tasks = [
    { id: "1", text: "a", done: true },
    { id: "2", text: "b", done: false },
  ];
  const snapshot = structuredClone(tasks);

  assert.equal(getMishiMood(tasks), "happy");
  assert.deepEqual(tasks, snapshot);
});

test("getMishiMood con más pendientes que hechas devuelve 'bored'", () => {
  const tasks = [
    { id: "1", text: "a", done: true },
    { id: "2", text: "b", done: false },
    { id: "3", text: "c", done: false },
  ];
  const snapshot = structuredClone(tasks);

  assert.equal(getMishiMood(tasks), "bored");
  assert.deepEqual(tasks, snapshot);
});

test("getMishiMood con todas las tareas hechas devuelve 'happy'", () => {
  const tasks = [{ id: "1", text: "a", done: true }];
  const snapshot = structuredClone(tasks);

  assert.equal(getMishiMood(tasks), "happy");
  assert.deepEqual(tasks, snapshot);
});

test("getMishiEmoji devuelve el emoji de cada ánimo", () => {
  assert.equal(getMishiEmoji("sleeping"), "😴");
  assert.equal(getMishiEmoji("happy"), "😺");
  assert.equal(getMishiEmoji("bored"), "😿");
});

test("getMishiPhrase devuelve frases no vacías y distintas para cada ánimo", () => {
  const happy = getMishiPhrase("happy");
  const bored = getMishiPhrase("bored");
  const sleeping = getMishiPhrase("sleeping");

  for (const phrase of [happy, bored, sleeping]) {
    assert.equal(typeof phrase, "string");
    assert.notEqual(phrase.trim(), "");
  }

  assert.notEqual(happy, bored);
  assert.notEqual(happy, sleeping);
  assert.notEqual(bored, sleeping);
});

test("getMishiPhrase con un ánimo desconocido devuelve la frase de 'sleeping'", () => {
  assert.equal(getMishiPhrase("otra-cosa"), getMishiPhrase("sleeping"));
});
