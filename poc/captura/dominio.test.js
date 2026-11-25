// Pruebas de dominio.js. Ejecutar desde la raíz del repositorio:
//   node --test "poc/captura/*.test.js"
// Datos ficticios: el ejemplo de la sección 4 del documento 02.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  interpretarMonto,
  comisionEstimada,
  saldoEstimado,
  textoDeSaldo,
  formatoCOP,
  resumenDeTiempos,
} from "./dominio.js";

const carrerasDelEjemplo = [
  { plataforma: "uber", medioDePago: "tarjeta", montoAnotado: 60000 },
  { plataforma: "uber", medioDePago: "efectivo", montoAnotado: 40000 },
  { plataforma: "didi", medioDePago: "tarjeta", montoAnotado: 30000 },
  { plataforma: "didi", medioDePago: "nequi", montoAnotado: 20000 },
];

test("interpretarMonto acepta enteros positivos y puntos de miles (RN-06)", () => {
  assert.deepEqual(interpretarMonto("15000"), { valido: true, montoAnotado: 15000 });
  assert.deepEqual(interpretarMonto("15.000"), { valido: true, montoAnotado: 15000 });
  assert.deepEqual(interpretarMonto(" 8 500 "), { valido: true, montoAnotado: 8500 });
});

test("interpretarMonto rechaza vacío, 0, texto, decimales y montos enormes (RN-06, RNF-11)", () => {
  for (const texto of ["", "   ", "0", "000", "abc", "12,5", "-5000", "1234567890", null, undefined]) {
    assert.equal(interpretarMonto(texto).valido, false, `debería rechazar ${JSON.stringify(texto)}`);
  }
});

test("comisionEstimada sigue RN-11 con el ejemplo del documento 02", () => {
  assert.equal(comisionEstimada(carrerasDelEjemplo[0], 20), 0);
  assert.equal(comisionEstimada(carrerasDelEjemplo[1], 20), 8000);
  assert.equal(comisionEstimada(carrerasDelEjemplo[3], 20), 4000);
});

test("comisionEstimada redondea al peso más cercano", () => {
  assert.equal(comisionEstimada({ medioDePago: "efectivo", montoAnotado: 7777 }, 20), 1555);
  assert.equal(comisionEstimada({ medioDePago: "nequi", montoAnotado: 7778 }, 20), 1556);
});

test("saldoEstimado reproduce el ejemplo del documento 02 (RN-12)", () => {
  assert.equal(saldoEstimado(carrerasDelEjemplo, "uber", 20), 52000);
  assert.equal(saldoEstimado(carrerasDelEjemplo, "didi", 20), 26000);
  assert.equal(saldoEstimado([], "uber", 20), 0);
});

test("textoDeSaldo usa lenguaje directo (RN-15) y formato COP", () => {
  assert.equal(textoDeSaldo("uber", 52000), "Uber te debe $ 52.000");
  assert.equal(textoDeSaldo("didi", -4000), "Debes consignar $ 4.000 a Didi");
  assert.equal(textoDeSaldo("uber", 0), "Uber: sin saldo pendiente");
  assert.equal(formatoCOP(1500000), "$ 1.500.000");
});

test("resumenDeTiempos calcula promedio, mediana y carreras dentro de la meta", () => {
  assert.deepEqual(resumenDeTiempos([]), { cantidad: 0, promedio: null, mediana: null, dentroDeMeta: 0 });
  const r = resumenDeTiempos([12, 6, 8, 10]);
  assert.equal(r.cantidad, 4);
  assert.equal(r.promedio, 9);
  assert.equal(r.mediana, 9);
  assert.equal(r.dentroDeMeta, 3);
  assert.equal(resumenDeTiempos([5, 20, 7]).mediana, 7);
});
