// Reglas de la prueba de concepto de captura (incremento 0, documento 03).
// Funciones puras: no usan el DOM ni almacenamiento (ADR-001).
// Los nombres siguen el glosario del documento 02.

export const PLATAFORMAS = Object.freeze({ uber: "Uber", didi: "Didi" });

export const MEDIOS_DE_PAGO = Object.freeze({
  tarjeta: "Tarjeta",
  efectivo: "Efectivo",
  nequi: "Nequi",
});

// RN-10, D-03: 20 % por defecto para ambas plataformas.
export const PORCENTAJE_COMISION_POR_DEFECTO = 20;

// OBJ-01 y HU-04 criterio 8.
export const META_SEGUNDOS = 10;

// Validación de longitud (RNF-11): hasta 9 dígitos (menos de mil millones).
const MAXIMO_DIGITOS = 9;

/**
 * Interpreta el texto escrito en el campo de monto (RN-06).
 * Acepta solo dígitos; ignora espacios y puntos de miles.
 * @param {string} texto
 * @returns {{ valido: true, montoAnotado: number } | { valido: false, error: string }}
 */
export function interpretarMonto(texto) {
  const limpio = String(texto ?? "").replace(/[\s.]/g, "");
  if (limpio === "") {
    return { valido: false, error: "Escribe el monto de la carrera." };
  }
  if (!/^\d+$/.test(limpio)) {
    return { valido: false, error: "El monto solo puede tener números." };
  }
  if (limpio.length > MAXIMO_DIGITOS) {
    return { valido: false, error: "El monto es demasiado grande." };
  }
  const montoAnotado = Number(limpio);
  if (montoAnotado <= 0) {
    return { valido: false, error: "El monto debe ser mayor que 0." };
  }
  return { valido: true, montoAnotado };
}

/**
 * Comisión estimada de una carrera (RN-11).
 * Con tarjeta es 0 porque el monto anotado ya viene sin comisión (RN-08).
 * @param {{ montoAnotado: number, medioDePago: string }} carrera
 * @param {number} porcentajeComision Porcentaje entero, por ejemplo 20.
 * @returns {number}
 */
export function comisionEstimada(carrera, porcentajeComision) {
  if (carrera.medioDePago === "tarjeta") return 0;
  return Math.round((carrera.montoAnotado * porcentajeComision) / 100);
}

/**
 * Saldo estimado de una plataforma (RN-12), simplificado para la prueba de
 * concepto: el saldo de partida es 0 (RN-13) y no hay depósitos,
 * consignaciones ni conciliaciones.
 * @param {Array<{ plataforma: string, montoAnotado: number, medioDePago: string }>} carreras
 * @param {string} plataforma
 * @param {number} porcentajeComision
 * @returns {number}
 */
export function saldoEstimado(carreras, plataforma, porcentajeComision) {
  let saldo = 0;
  for (const carrera of carreras) {
    if (carrera.plataforma !== plataforma) continue;
    if (carrera.medioDePago === "tarjeta") {
      saldo += carrera.montoAnotado;
    } else {
      saldo -= comisionEstimada(carrera, porcentajeComision);
    }
  }
  return saldo;
}

/**
 * Texto del saldo en lenguaje directo (RN-15).
 * @param {string} plataforma
 * @param {number} saldo
 * @returns {string}
 */
export function textoDeSaldo(plataforma, saldo) {
  const nombre = PLATAFORMAS[plataforma];
  if (saldo > 0) return `${nombre} te debe ${formatoCOP(saldo)}`;
  if (saldo < 0) return `Debes consignar ${formatoCOP(-saldo)} a ${nombre}`;
  return `${nombre}: sin saldo pendiente`;
}

const formatoMiles = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
const formatoUnDecimal = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Monto en COP sin decimales y con punto de miles: "$ 52.000". */
export function formatoCOP(monto) {
  return `$ ${formatoMiles.format(monto)}`;
}

/** Segundos con un decimal y coma decimal: "7,3 s". */
export function formatoSegundos(segundos) {
  return `${formatoUnDecimal.format(segundos)} s`;
}

/**
 * Resumen de tiempos de registro.
 * @param {number[]} segundos
 * @returns {{ cantidad: number, promedio: number|null, mediana: number|null, dentroDeMeta: number }}
 */
export function resumenDeTiempos(segundos) {
  const cantidad = segundos.length;
  if (cantidad === 0) {
    return { cantidad: 0, promedio: null, mediana: null, dentroDeMeta: 0 };
  }
  const ordenados = [...segundos].sort((a, b) => a - b);
  const mitad = Math.floor(cantidad / 2);
  const mediana =
    cantidad % 2 === 0 ? (ordenados[mitad - 1] + ordenados[mitad]) / 2 : ordenados[mitad];
  const promedio = segundos.reduce((suma, s) => suma + s, 0) / cantidad;
  const dentroDeMeta = segundos.filter((s) => s <= META_SEGUNDOS).length;
  return { cantidad, promedio, mediana, dentroDeMeta };
}

/**
 * Resultados en texto separado por tabulaciones, para pegar en una hoja de cálculo.
 * @param {Array<{ numero: number, hora: string, montoAnotado: number, plataforma: string, medioDePago: string, segundos: number, huboCambios: boolean }>} carreras
 * @returns {string}
 */
export function textoDeResultados(carreras) {
  const encabezado = ["N.º", "Hora", "Monto", "Plataforma", "Medio de pago", "Segundos", "Cambió plataforma o medio"];
  const filas = carreras.map((c) => [
    c.numero,
    c.hora,
    c.montoAnotado,
    PLATAFORMAS[c.plataforma],
    MEDIOS_DE_PAGO[c.medioDePago],
    formatoUnDecimal.format(c.segundos),
    c.huboCambios ? "Sí" : "No",
  ]);
  return [encabezado, ...filas].map((fila) => fila.join("\t")).join("\n");
}
