// Interfaz y cronómetro de la prueba de concepto de captura (HU-04, criterios 1 a 4 y 8).
// Los datos viven solo en memoria: no hay IndexedDB ni service worker.
// Los datos del usuario se insertan siempre con textContent (ADR-005).

import {
  PLATAFORMAS,
  MEDIOS_DE_PAGO,
  PORCENTAJE_COMISION_POR_DEFECTO,
  META_SEGUNDOS,
  interpretarMonto,
  textoDeSaldo,
  saldoEstimado,
  formatoCOP,
  formatoSegundos,
  resumenDeTiempos,
  textoDeResultados,
} from "./dominio.js";

const $ = (id) => document.getElementById(id);

const ui = {
  abrirRegistro: $("abrir-registro"),
  registro: $("registro"),
  monto: $("monto"),
  error: $("error-monto"),
  cancelar: $("cancelar"),
  confirmacion: $("confirmacion"),
  saldoUber: $("saldo-uber"),
  saldoDidi: $("saldo-didi"),
  resumenSinCambios: $("resumen-sin-cambios"),
  resumenTodas: $("resumen-todas"),
  lista: $("lista-carreras"),
  copiar: $("copiar"),
  estadoCopia: $("estado-copia"),
  textoCopia: $("texto-copia"),
  grupos: document.querySelectorAll(".opciones"),
};

const estado = {
  carreras: [], // De la más antigua a la más reciente.
  // RN-07: se preseleccionan la plataforma y el medio de la última carrera.
  // Para la primera carrera se usan Uber y tarjeta.
  ultima: { plataforma: "uber", medioDePago: "tarjeta" },
  seleccion: { plataforma: "uber", medioDePago: "tarjeta" },
  inicio: null, // performance.now() al abrir el registro.
  temporizadorConfirmacion: null,
};

// --- Registro --------------------------------------------------------------

function abrirRegistro() {
  estado.inicio = performance.now();
  estado.seleccion = { ...estado.ultima };
  ui.monto.value = "";
  ui.error.textContent = "";
  ocultarConfirmacion();
  pintarOpciones();
  ui.abrirRegistro.hidden = true;
  ui.registro.hidden = false;
  // Solo el formulario, arriba, para que quede completo encima del teclado.
  document.body.classList.add("registrando");
  window.scrollTo(0, 0);
  // Criterio 1: el foco se da dentro del mismo toque para que Chrome en
  // Android abra el teclado numérico sin tocar el campo.
  ui.monto.focus({ preventScroll: true });
}

function cerrarRegistro() {
  estado.inicio = null;
  document.body.classList.remove("registrando");
  ui.registro.hidden = true;
  ui.abrirRegistro.hidden = false;
  ui.abrirRegistro.focus({ preventScroll: true });
}

function guardar(evento) {
  evento.preventDefault();
  if (estado.inicio === null) return;

  const resultado = interpretarMonto(ui.monto.value);
  if (!resultado.valido) {
    ui.error.textContent = resultado.error;
    ui.monto.focus();
    return;
  }

  // Criterio 8: segundos desde que se abrió el registro hasta que se guarda.
  const segundos = (performance.now() - estado.inicio) / 1000;
  const { plataforma, medioDePago } = estado.seleccion;
  const carrera = {
    numero: estado.carreras.length + 1,
    hora: new Date().toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" }),
    montoAnotado: resultado.montoAnotado,
    plataforma,
    medioDePago,
    segundos,
    huboCambios:
      plataforma !== estado.ultima.plataforma || medioDePago !== estado.ultima.medioDePago,
  };

  estado.carreras.push(carrera);
  estado.ultima = { plataforma, medioDePago };
  cerrarRegistro();
  mostrarConfirmacion(carrera);
  pintarTodo();
}

// Criterio 3: cada cambio de plataforma o medio de pago es un solo toque.
function elegirOpcion(evento) {
  const boton = evento.target.closest("button[data-valor]");
  if (!boton) return;
  const grupo = boton.parentElement.dataset.grupo;
  estado.seleccion[grupo] = boton.dataset.valor;
  pintarOpciones();
  // Mantiene el teclado abierto después de tocar una opción.
  ui.monto.focus({ preventScroll: true });
}

function pintarOpciones() {
  for (const grupo of ui.grupos) {
    const elegido = estado.seleccion[grupo.dataset.grupo];
    for (const boton of grupo.querySelectorAll("button[data-valor]")) {
      boton.setAttribute("aria-pressed", String(boton.dataset.valor === elegido));
    }
  }
}

// --- Confirmación (criterio 4) ----------------------------------------------

function mostrarConfirmacion(carrera) {
  ui.confirmacion.textContent =
    `Guardada: ${formatoCOP(carrera.montoAnotado)} · ` +
    `${PLATAFORMAS[carrera.plataforma]} · ${MEDIOS_DE_PAGO[carrera.medioDePago]}`;
  ui.confirmacion.hidden = false;
  clearTimeout(estado.temporizadorConfirmacion);
  estado.temporizadorConfirmacion = setTimeout(ocultarConfirmacion, 4000);
}

function ocultarConfirmacion() {
  clearTimeout(estado.temporizadorConfirmacion);
  ui.confirmacion.hidden = true;
}

// --- Saldos, resumen y lista ---------------------------------------------------

function pintarTodo() {
  pintarSaldos();
  pintarResumen();
  pintarLista();
  ui.copiar.disabled = estado.carreras.length === 0;
}

function pintarSaldos() {
  const p = PORCENTAJE_COMISION_POR_DEFECTO;
  ui.saldoUber.textContent = textoDeSaldo("uber", saldoEstimado(estado.carreras, "uber", p));
  ui.saldoDidi.textContent = textoDeSaldo("didi", saldoEstimado(estado.carreras, "didi", p));
}

function textoDeResumen(segundos) {
  const r = resumenDeTiempos(segundos);
  if (r.cantidad === 0) return "Sin carreras";
  const carreras = r.cantidad === 1 ? "1 carrera" : `${r.cantidad} carreras`;
  return (
    `${carreras} · promedio ${formatoSegundos(r.promedio)} · mediana ${formatoSegundos(r.mediana)} · ` +
    `${r.dentroDeMeta} de ${r.cantidad} en ${META_SEGUNDOS} s o menos`
  );
}

function pintarResumen() {
  const todas = estado.carreras.map((c) => c.segundos);
  const sinCambios = estado.carreras.filter((c) => !c.huboCambios).map((c) => c.segundos);
  ui.resumenSinCambios.textContent = textoDeResumen(sinCambios);
  ui.resumenTodas.textContent = textoDeResumen(todas);
}

function pintarLista() {
  const items = [...estado.carreras].reverse().map((carrera) => {
    const li = document.createElement("li");
    li.className = "item";

    const titulo = document.createElement("span");
    titulo.textContent = `N.º ${carrera.numero} · ${formatoCOP(carrera.montoAnotado)}`;

    const tiempo = document.createElement("span");
    tiempo.className = "item-tiempo";
    if (carrera.segundos > META_SEGUNDOS) tiempo.classList.add("fuera-de-meta");
    tiempo.textContent = formatoSegundos(carrera.segundos);

    const detalle = document.createElement("span");
    detalle.className = "item-detalle";
    const partes = [
      PLATAFORMAS[carrera.plataforma],
      MEDIOS_DE_PAGO[carrera.medioDePago],
      carrera.hora,
    ];
    if (carrera.huboCambios) partes.push("cambió plataforma o medio");
    detalle.textContent = partes.join(" · ");

    li.append(titulo, tiempo, detalle);
    return li;
  });
  ui.lista.replaceChildren(...items);
}

// --- Copiar resultados ------------------------------------------------------------

async function copiarResultados() {
  const texto = textoDeResultados(estado.carreras);
  try {
    await navigator.clipboard.writeText(texto);
    ui.textoCopia.hidden = true;
    ui.estadoCopia.textContent = "Resultados copiados. Pégalos en una hoja de cálculo.";
  } catch {
    // El portapapeles exige HTTPS o localhost; si no está disponible, se muestra el texto.
    ui.textoCopia.value = texto;
    ui.textoCopia.hidden = false;
    ui.textoCopia.select();
    ui.estadoCopia.textContent = "No se pudo copiar automáticamente. Copia el texto de abajo.";
  }
}

// --- Eventos -------------------------------------------------------------------------

ui.abrirRegistro.addEventListener("click", abrirRegistro);
ui.cancelar.addEventListener("click", cerrarRegistro);
ui.registro.addEventListener("submit", guardar);
ui.copiar.addEventListener("click", copiarResultados);
for (const grupo of ui.grupos) {
  grupo.addEventListener("click", elegirOpcion);
  // Evita que tocar una opción le quite el foco al campo y cierre el teclado.
  grupo.addEventListener("mousedown", (evento) => evento.preventDefault());
}

// Avisa antes de recargar o cerrar si hay resultados sin copiar.
window.addEventListener("beforeunload", (evento) => {
  if (estado.carreras.length > 0) evento.preventDefault();
});

pintarTodo();
