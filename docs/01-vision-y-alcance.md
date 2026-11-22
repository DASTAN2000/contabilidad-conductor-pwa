# 01 — Visión y alcance

| Campo | Valor |
|---|---|
| Proyecto | App de contabilidad para conductor de plataformas de transporte (nombre por definir) |
| Versión | 0.2 |
| Fecha | 2026-11-21 |
| Autor | Sergio Alexander Sepúlveda Alvarado |
| Cliente | Conductor de Uber y Didi (usuario único en la v1) |
| Estado | Aprobada por el desarrollador; pendiente de aprobación del cliente |

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 2026-11-18 | Primer borrador |
| 0.2 | 2026-11-21 | Incorpora las rondas 1 y 2 de entrevista y las fotos del cuaderno: registro por carrera, plataforma por carrera, saldo acumulado de las plataformas, método de sobres, dos ciclos semanales, categorías de gasto y supuestos pendientes |

---

## 1. Problema

El conductor trabaja con Uber y Didi al mismo tiempo, alternando entre ellas en una misma salida, y lleva sus cuentas a mano. Hoy:

1. **Anota lo mismo tres veces.** Cada carrera en una hoja de carreras, los totales del día en la tabla "Contabilidad del Auto" y la semana en la hoja de liquidaciones.
2. **No registra la plataforma de cada carrera.** Como alterna Uber y Didi, no puede saber cuánto le debe o cuánto debe a cada una.
3. **El cruce de cuentas de las plataformas es difícil de seguir.** Cada plataforma lleva un saldo que sube con los viajes pagados con tarjeta (ya descontada la comisión) y baja con la comisión de los viajes en efectivo o Nequi. El conductor describe el resumen de las plataformas como "muy confuso".
4. **La comisión es variable.** El conductor la estima entre 15 % y 20 %, pero cambia por viaje, así que no se puede calcular exacto con un porcentaje fijo.
5. **La liquidación semanal es manual.** Usa un método de sobres (gastos y ganancias) que calcula a mano cada semana y cada mes.

## 2. Partes interesadas

| Parte | Rol | Interés principal |
|---|---|---|
| Conductor | Cliente y único usuario de la v1 | Registrar rápido, saber cuánto gana de verdad y cuadrar con cada plataforma |
| Sergio | Desarrollador | Entregar una solución útil, gratuita y documentada para portafolio |
| Uber y Didi | Entidades externas (sin integración) | Fuente del saldo real de cada plataforma |

**Perfil del usuario:** celular Android; carro propio, que también usa para asuntos personales; trabaja principalmente de noche; puede tener varios turnos en una fecha; hace entre 12 y 20 carreras por turno y alterna plataformas entre carreras; registra detenido, nunca en movimiento.

## 3. Declaración de visión

> Para el conductor que trabaja con Uber y Didi a la vez y lleva sus cuentas en un cuaderno, el sistema es una aplicación web para el celular que registra cada carrera en pocos segundos, separa las cuentas de cada plataforma, calcula la utilidad real y hace la liquidación semanal con su propio método de sobres. A diferencia del cuaderno, cada dato se anota una sola vez; a diferencia del resumen de las plataformas, une las dos en una sola vista clara. Funciona sin internet y sin costo.

## 4. Objetivos y criterios de éxito

| ID | Objetivo | Cómo se mide |
|---|---|---|
| OBJ-01 | Registrar una carrera en 10 segundos o menos | Cronometrado en la prueba de concepto y en la prueba de campo |
| OBJ-02 | Cerrar un turno (km final, gastos y apartados) en 30 segundos o menos | Cronometrado en la prueba de campo |
| OBJ-03 | Liquidación semanal y mensual correctas | Los resultados coinciden con los casos de prueba construidos a partir del cuaderno del conductor (con su permiso) |
| OBJ-04 | Saldo estimado por plataforma cercano al real | Se compara el saldo estimado con el saldo real de cada plataforma durante la prueba de campo |
| OBJ-05 | Reemplazar el cuaderno | Tras 4 semanas de uso, el conductor ya no usa el cuaderno |
| OBJ-06 | Costo de operación $0 | Sin servicios de pago en la v1 |

## 5. Alcance de la versión 1 (MVP)

### Registro

| ID | Funcionalidad |
|---|---|
| F-01 | **Turnos:** inicio y fin (hora tomada al tocar un botón, editable), km inicial (sugerido con el km final del turno anterior, editable por el uso personal del carro), km final y km recorrido calculado |
| F-02 | **Carreras:** monto, plataforma (Uber o Didi) y medio de pago (tarjeta, efectivo o Nequi). La plataforma y el medio quedan preseleccionados con la última opción usada |
| F-03 | **Gastos reales:** gasolina, parqueadero, lavado y mantenimiento realizado (ej. cambio de aceite), independientes del turno |
| F-04 | **Apartados por turno:** valor apartado para mantenimiento, sugerido con el último valor y editable |
| F-05 | **Captura rápida:** teclado numérico, botones grandes, dictado opcional con el micrófono del teclado y confirmación antes de guardar |

### Cálculos y liquidaciones

| ID | Funcionalidad |
|---|---|
| F-06 | **Saldo estimado por plataforma:** suma de los valores netos con tarjeta menos la comisión estimada de los viajes en efectivo y Nequi, con porcentaje configurable por plataforma |
| F-07 | **Conciliación:** en cualquier momento, el conductor ingresa el saldo real que muestra cada plataforma y el sistema registra la diferencia y ajusta su estimación |
| F-08 | **Corte de plataforma:** día de corte configurable por plataforma (martes por defecto) |
| F-09 | **Liquidación semanal personal con método de sobres:** total trabajado, sobre de gastos (gastos reales + apartados), sobre de ganancias y sobrante del sobre de gastos. Semana configurable (lunes a domingo por defecto), independiente del corte de plataforma |
| F-10 | **Liquidación mensual:** consolidado de las semanas del mes |
| F-11 | **Indicadores:** utilidad por turno, por hora y por km |

### Datos y plataforma

| ID | Funcionalidad |
|---|---|
| F-12 | Exportación a CSV |
| F-13 | Respaldo y restauración de los datos (archivo JSON) |
| F-14 | Instalable en el celular (PWA) y funcional sin conexión a internet |

## 6. Fuera de alcance de la v1

| Elemento | Motivo | Fase posible |
|---|---|---|
| Varios usuarios, login y sincronización en la nube | Un solo usuario en la v1; requiere servidor | Fase 2 |
| Registro por Telegram o WhatsApp (n8n) | Requiere servidor | Fase 2 |
| Cobro a usuarios y pasarela de pago | No aplica con un usuario | Fase 2 |
| Integración con las API de Uber o Didi | No hay acceso previsto | No planeado |
| Recordatorios de mantenimiento por kilometraje y gráficas | Mejoras, no esenciales para reemplazar el cuaderno | v1.x |

La arquitectura de la v1 debe permitir agregar la fase 2 sin reescribir la aplicación: identificadores únicos por registro, campo de usuario y una capa de acceso a datos reemplazable.

## 7. Restricciones

- Costo $0: sin servidores ni servicios de pago.
- Plataforma objetivo: Android con Chrome.
- Publicación en GitHub Pages (HTTPS, requisito de las PWA).
- Datos almacenados solo en el dispositivo del usuario.
- Diseño mobile-first: botones grandes, alto contraste.
- Seguridad: requisitos aplicables de OWASP ASVS nivel 1, gestión de riesgos según ISO 31000 y controles de referencia del Anexo A de ISO/IEC 27001.
- El nombre del producto y del repositorio no usa marcas de terceros (Uber, Didi).

## 8. Supuestos

| ID | Supuesto | Estado | Cómo se valida |
|---|---|---|---|
| S-01 | Uber y Didi depositan el martes, a más tardar a las 3 p. m. | Confirmado por el cliente | — |
| S-02 | En viajes con tarjeta, la plataforma muestra el valor neto y ese es el que anota el conductor | Confirmado por el cliente | — |
| S-03 | Cada plataforma muestra su saldo acumulado en cualquier momento | Supuesto (Sergio) | Prueba de campo |
| S-04 | En la lista de viajes, el valor principal de un viaje en efectivo es la ganancia neta del conductor | Supuesto (Sergio) | Prueba de campo |
| S-05 | Didi muestra información equivalente a la de Uber | Supuesto (Sergio) | Prueba de campo |
| S-06 | Días de trabajo que cubre el depósito del martes | Desconocido; se resuelve con el corte configurable | Prueba de campo |
| S-07 | El parqueadero no se resta en el "total de semana a favor" de la liquidación actual, aunque es gasto real | Inconsistencia sin aclarar | Con el conductor, antes de cerrar las reglas de negocio |
| S-08 | El conductor registra siempre detenido | Confirmado | — |

## 9. Riesgos principales

Lista inicial. La matriz completa (probabilidad, impacto y tratamiento según ISO 31000) va en un documento aparte.

| ID | Riesgo | Tratamiento previsto |
|---|---|---|
| R-01 | Pérdida de datos por borrado del navegador o pérdida del celular | Respaldo (F-13) y recordatorio periódico de respaldar |
| R-02 | Error al ingresar o dictar un monto | Confirmación antes de guardar (F-05) y edición posterior |
| R-03 | El saldo estimado difiere del real por la comisión variable | Conciliación con el saldo real (F-07) |
| R-04 | Registrar toma más tiempo que el cuaderno y el conductor abandona la app | Prueba de concepto de captura antes del diseño final |
| R-05 | Confusión entre "saldo a favor" (de la plataforma) y "total de semana a favor" (sobrante del sobre de gastos) | Glosario y nombres distintos en la interfaz |
| R-06 | Supuestos S-03 a S-07 resultan falsos | Validarlos en la prueba de campo; los valores afectados son configurables |

## 10. Preguntas abiertas

1. ¿Qué días de trabajo cubre el depósito del martes? (S-06)
2. ¿Por qué el parqueadero no se resta en la liquidación? (S-07)
3. Nombre del producto.

## 11. Documentos relacionados

- Registro de entrevistas con el cliente (rondas 1 y 2) y análisis de su cuaderno: se conserva fuera de este repositorio porque contiene datos personales y financieros del cliente (principio de minimización de datos).
- Siguiente documento: 02 — Glosario y reglas de negocio

## 12. Aprobación

| Rol | Nombre | Fecha | Medio |
|---|---|---|---|
| Cliente | | | |
| Desarrollador | Sergio Alexander Sepúlveda Alvarado | 2026-11-21 | Revisión del documento |

## Referencias

- Wiegers, K. y Beatty, J. (2013). *Software Requirements* (3.ª ed.). Microsoft Press. Plantilla de documento de visión y alcance.
