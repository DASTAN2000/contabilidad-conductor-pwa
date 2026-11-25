# Prueba de concepto: captura de carreras

Incremento 0 del [documento 03](../../docs/03-historias-de-usuario.md#4-plan-de-entregas). Página mínima para medir con el conductor si registrar una carrera cabe en 10 segundos (OBJ-01) antes de diseñar el resto del sistema.

**Es desechable.** No forma parte de la aplicación: no tiene IndexedDB ni service worker, y los datos se borran al recargar la página. El incremento 1 se construye aparte, en `js/`, según el [documento 06](../../docs/06-decisiones-de-arquitectura.md).

## Qué cubre

| HU-04 | Cómo se cumple |
|---|---|
| Criterio 1 | Al tocar "Registrar carrera", el campo de monto recibe el foco y se abre el teclado numérico |
| Criterio 2 | La plataforma y el medio de pago quedan preseleccionados con los de la última carrera (RN-07). La primera carrera parte de Uber y tarjeta |
| Criterio 3 | Plataforma y medio de pago se cambian con un toque |
| Criterio 4 | Al guardar aparece una confirmación con monto, plataforma y medio de pago, y se actualiza el saldo estimado de esa plataforma (RN-11, RN-12, 20 % de comisión) |
| Criterio 8 | Cada carrera guarda los segundos entre abrir el registro y guardarla. El resumen separa las carreras en las que no se cambió plataforma ni medio, que son las que mide el criterio |

También rechaza el monto vacío o en 0 (criterio 6). No incluye el límite de verificación (criterio 5) ni los turnos (HU-01): la página asume un turno abierto.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Página, con política de seguridad de contenido en `meta` (ADR-005) |
| `estilos.css` | CSS propio con variables y tema claro (ADR-003) |
| `dominio.js` | Reglas puras, sin DOM (ADR-001) |
| `app.js` | Interfaz y cronómetro |
| `dominio.test.js` | Pruebas de `dominio.js` |

## Cómo ejecutarla

Los módulos ES no funcionan abriendo el archivo desde el disco: la página debe servirse por HTTP.

**En el celular del conductor (recomendado):** activar GitHub Pages en el repositorio (rama `main`, carpeta raíz) y abrir `https://<usuario>.github.io/<repositorio>/poc/captura/` en Chrome. Con HTTPS funciona el botón "Copiar resultados".

**En el computador:** cualquier servidor estático en la raíz del repositorio, por ejemplo con Python:

```
python -m http.server 8000
```

y abrir `http://localhost:8000/poc/captura/`. Desde otro equipo de la red local la página funciona, pero el portapapeles no está disponible por no ser HTTPS; en ese caso "Copiar resultados" muestra el texto para copiarlo a mano.

**Pruebas**, desde la raíz del repositorio, con Node LTS:

```
node --test "poc/captura/*.test.js"
```

## Protocolo de la sesión con el conductor

1. Explicarle la pantalla una vez y dejar que registre 3 carreras de práctica. Recargar la página para borrarlas.
2. Pedirle que registre entre 15 y 20 carreras con montos inventados, alternando plataformas y medios como en un turno real. Mejor si lo hace detenido en el carro, como lo hará de verdad (S-08).
3. No mostrarle el cronómetro ni apurarlo: la página no muestra el tiempo mientras registra, a propósito.
4. Al terminar, tocar "Copiar resultados" y pegar el texto en una hoja de cálculo.
5. Anotar lo que observes: si el teclado se abrió solo (criterio 1), dónde dudó y qué pidió cambiar.

**Criterio de éxito:** la mediana de las carreras sin cambio de plataforma ni medio es de 10 segundos o menos.

**Privacidad:** los resultados de la sesión no se suben al repositorio, aunque los montos sean inventados. Se guardan con el registro de entrevistas, fuera del repositorio.
