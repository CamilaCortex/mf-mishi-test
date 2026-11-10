# Reglas para agentes en este repo

- Web estática: HTML + CSS + JavaScript (módulos ES). **Sin dependencias** (nada de npm install).
- La lógica va en `src/logic.js` como funciones puras exportadas: sin DOM, sin red, sin
  `Date.now()` implícito (la fecha llega como parámetro), sin modificar argumentos.
- `src/app.js` conecta la lógica con la página (DOM, eventos, localStorage).
- Tests en `tests/*.test.js` con `node:test` y `node:assert/strict`. No borrar ni debilitar tests.
- Accesible: botones de verdad, etiquetas en los campos, foco visible, `prefers-reduced-motion`.
