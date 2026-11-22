# 02 — Glosario y reglas de negocio

| Campo | Valor |
|---|---|
| Proyecto | App de contabilidad para conductor de plataformas de transporte (nombre por definir) |
| Versión | 0.2 |
| Fecha | 2026-11-21 |
| Autor | Sergio Alexander Sepúlveda Alvarado |
| Estado | Aprobada por el desarrollador; pendiente de aprobación del cliente y de la decisión D-02 |
| Documento base | [01 — Visión y alcance](01-vision-y-alcance.md) v0.2 |

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 2026-11-21 | Primer borrador |
| 0.2 | 2026-11-21 | Decisiones D-01, D-03 y D-04 tomadas. El fondo de mantenimiento se liquida cada mes (S-10) |

---

## 1. Propósito

Definir con precisión los términos del dominio y las reglas que el sistema aplica para registrar, calcular y liquidar. Este documento es la referencia para las historias de usuario (03), el modelo de datos (04) y los casos de prueba (08): si una regla cambia aquí, cambia en todos.

Convenciones:
- Montos en pesos colombianos (COP), enteros, sin decimales.
- Los redondeos se hacen al peso más cercano.
- "Configurable" significa que el conductor puede cambiar el valor en la configuración del sistema.

## 2. Glosario

La columna "En el cuaderno" indica cómo llama hoy el conductor a ese concepto, para facilitar la transición. Los nombres de la columna "Término" son los que usa el sistema.

### 2.1 Trabajo

| Término | Definición | En el cuaderno |
|---|---|---|
| Turno | Periodo continuo de trabajo con hora de inicio y de fin. Puede cruzar la medianoche | Fila del día / "hora de trabajo" |
| Carrera | Un viaje realizado para una plataforma, con un monto y un medio de pago | Línea de la hoja de carreras |
| Plataforma | Empresa a través de la cual se hizo la carrera: Uber o Didi | "Plataforma" |
| Medio de pago | Forma en que pagó el pasajero: tarjeta, efectivo o Nequi | T. CRE / EFECTIVO / NEQUI |
| Km recorrido | Km final del turno menos km inicial del turno | "K/M recorrido" |
| Km fuera de turno | Diferencia entre el km inicial de un turno y el km final del turno anterior. Corresponde a uso personal del carro | — |

### 2.2 Dinero de las carreras

| Término | Definición | En el cuaderno |
|---|---|---|
| Monto anotado | Valor que el conductor registra por carrera. Con tarjeta es el valor neto que muestra la plataforma; con efectivo o Nequi es lo cobrado al pasajero | Valor de cada carrera |
| Comisión | Parte del valor de la carrera que se queda la plataforma. Es variable por carrera | "Descuento" |
| Comisión estimada | Comisión calculada por el sistema para una carrera en efectivo o Nequi, con el porcentaje configurado | — |
| Total trabajado | Suma de los montos anotados en un periodo | "Total trabajado" / "Producido" |
| Ingreso neto | Total trabajado menos las comisiones estimadas de las carreras en efectivo y Nequi | — |

### 2.3 Cuentas con las plataformas

| Término | Definición | En el cuaderno |
|---|---|---|
| Saldo de plataforma | Cuenta corriente que cada plataforma lleva con el conductor. Sube con las carreras pagadas con tarjeta y baja con la comisión de las carreras en efectivo o Nequi. Positivo: la plataforma le debe al conductor. Negativo: el conductor le debe a la plataforma | "Saldo a favor semanal" / "Saldo" |
| Saldo estimado | Saldo de plataforma calculado por el sistema a partir de los registros | — |
| Saldo real | Saldo que muestra la plataforma en su aplicación, ingresado por el conductor | — |
| Conciliación | Registro del saldo real de una plataforma en un momento dado, para corregir el saldo estimado | — |
| Diferencia de conciliación | Saldo real menos saldo estimado al momento de conciliar | — |
| Corte | Día en que la plataforma liquida el saldo (martes por defecto) | "Corte" |
| Depósito | Dinero que la plataforma transfiere al conductor cuando el saldo es positivo | — |
| Consignación | Dinero que el conductor paga a la plataforma cuando el saldo es negativo | — |

### 2.4 Gastos y sobres

| Término | Definición | En el cuaderno |
|---|---|---|
| Gasto operativo | Gasto real del día a día que se paga al momento: gasolina y parqueadero | Gasolina, parqueadero |
| Gasto de fondo | Gasto real que se paga con el dinero apartado: lavado y mantenimiento realizado (ej. cambio de aceite) | "Menos: lavado, cambio de aceite…" |
| Apartado | Dinero que el conductor separa en un turno para mantenimiento futuro. No es un gasto: es dinero reservado | Columna "Mantenimiento" de la tabla diaria |
| Fondo de mantenimiento | Apartados del mes menos gastos de fondo del mes. Lo que sobra al cerrar el mes pasa a las ganancias del mes | — |
| Semana de liquidación | Periodo personal de cierre del conductor (lunes a domingo por defecto). Es independiente del corte de las plataformas | "Liquidación del … al …" |
| Sobre de gastos | Gastos operativos más apartados de una semana de liquidación | "Parqueadero, mantenimiento y gasolina" |
| Sobre de ganancias | Lo que queda para el conductor en la semana después de separar el sobre de gastos | "Sobre de ganancias" |
| Sobrante del sobre de gastos | Sobre de gastos menos los gastos reales pagados de él en la semana | "Total de semana a favor" |

**Términos que no deben confundirse:** "saldo de plataforma" (lo que la plataforma le debe al conductor o él a ella) y "sobrante del sobre de gastos" (lo que quedó del dinero separado para gastos). En el cuaderno se llaman "saldo a favor semanal" y "total de semana a favor", nombres casi iguales para conceptos distintos. El sistema nunca usa la expresión "a favor" sola.

## 3. Reglas de negocio

Cada regla indica la funcionalidad del documento 01 que la usa.

### 3.1 Turnos

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-01 | Un turno tiene hora de inicio, hora de fin, km inicial y km final. La hora de fin es posterior a la de inicio y el km final es mayor o igual al km inicial | F-01 |
| RN-02 | Km recorrido = km final − km inicial | F-01 |
| RN-03 | Un turno pertenece a la fecha y a la semana de liquidación de su hora de **inicio**, aunque termine al día siguiente | F-01, F-09 |
| RN-04 | El km inicial se sugiere con el km final del turno anterior y es editable. Si el conductor escribe un valor mayor, la diferencia se registra como km fuera de turno y no cuenta como trabajo | F-01 |
| RN-05 | Solo puede haber un turno abierto a la vez. Una carrera solo se registra dentro de un turno abierto o se asigna a un turno existente al editarla | F-01, F-02 |

### 3.2 Carreras

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-06 | Una carrera tiene monto anotado (entero mayor que 0), plataforma y medio de pago | F-02 |
| RN-07 | La plataforma y el medio de pago se preseleccionan con los de la última carrera registrada | F-02, F-05 |
| RN-08 | Con tarjeta, el monto anotado es el valor neto que muestra la plataforma (ya descontada la comisión). Con efectivo o Nequi, es lo cobrado al pasajero | F-02, F-06 |
| RN-09 | Si un monto supera el límite de verificación (200.000 por defecto, configurable), el sistema pide confirmarlo antes de guardar. No lo bloquea | F-05 |

### 3.3 Comisión y saldo de plataforma

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-10 | Cada plataforma tiene un porcentaje de comisión configurable, 20 % por defecto (D-03). Se prefiere sobrestimar la deuda: la conciliación corrige la diferencia | F-06 |
| RN-11 | Comisión estimada de una carrera en efectivo o Nequi = monto anotado × porcentaje de la plataforma, redondeado al peso. A las carreras con tarjeta no se les calcula comisión porque ya viene descontada | F-06 |
| RN-12 | Saldo estimado de una plataforma = saldo de partida + suma de carreras con tarjeta − suma de comisiones estimadas − depósitos + consignaciones, todo posterior al punto de partida | F-06 |
| RN-13 | El saldo de partida es el último saldo real conciliado. Si nunca se ha conciliado, es 0 desde el primer registro | F-06, F-07 |
| RN-14 | Al conciliar, el sistema guarda la fecha y hora, el saldo real, el saldo estimado en ese momento y la diferencia. El saldo real pasa a ser el nuevo saldo de partida | F-07 |
| RN-15 | El saldo se muestra en lenguaje directo: si es positivo, "Uber te debe X"; si es negativo, "Debes consignar X a Didi" | F-06 |
| RN-16 | Al registrar un depósito, el saldo baja en ese valor. Al registrar una consignación, el saldo sube en ese valor | F-08 |
| RN-17 | Cada plataforma tiene su día de corte configurable (martes por defecto). El sistema recuerda registrar el depósito o la consignación ese día | F-08 |

### 3.4 Gastos y apartados

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-18 | Un gasto real tiene fecha, categoría y monto (entero mayor que 0). Puede asociarse a un turno, pero no es obligatorio | F-03 |
| RN-19 | Categorías de gasto: gasolina y parqueadero son gastos operativos; lavado y mantenimiento realizado son gastos de fondo | F-03 |
| RN-20 | Un apartado se registra al cerrar un turno. Se sugiere con el valor del último apartado, es editable y puede ser 0 | F-04 |
| RN-21 | Fondo de mantenimiento del mes = apartados del mes − gastos de fondo del mes. No se acumula de un mes a otro (S-10). Puede quedar negativo; en ese caso el sistema lo advierte | F-04, F-10 |

### 3.5 Indicadores

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-22 | Utilidad de un turno = ingreso neto del turno − gastos operativos asociados al turno | F-11 |
| RN-23 | Utilidad por hora = utilidad del turno ÷ horas del turno. Utilidad por km = utilidad del turno ÷ km recorrido. Si el divisor es 0, el indicador no se muestra | F-11 |

### 3.6 Liquidaciones

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-24 | La semana de liquidación va de lunes 00:00 a domingo 23:59 por defecto. El día de inicio es configurable. Es independiente del día de corte de las plataformas | F-09 |
| RN-25 | Sobre de gastos de la semana = gastos operativos de la semana + apartados de la semana | F-09 |
| RN-26 | Sobre de ganancias de la semana = ingreso neto de la semana − sobre de gastos (D-01). Como referencia, el sistema muestra también el cálculo del cuaderno: total trabajado − sobre de gastos | F-09 |
| RN-27 | Sobrante del sobre de gastos = sobre de gastos − gastos operativos − gastos de fondo de la semana. Equivale a los apartados de la semana menos los gastos de fondo de la semana (ver D-02) | F-09 |
| RN-28 | La liquidación mensual suma los turnos y gastos cuya fecha cae dentro del mes calendario (D-04). Al cerrar el mes, el fondo de mantenimiento del mes se suma a las ganancias del mes si es positivo, o se resta si es negativo (RN-21) | F-10 |

### 3.7 Datos

| ID | Regla | Funcionalidad |
|---|---|---|
| RN-29 | Todo registro se puede editar y eliminar. Eliminar pide confirmación. Cualquier cambio recalcula saldos, indicadores y liquidaciones | F-01 a F-11 |
| RN-30 | Las conciliaciones no se editan: si hubo un error, se registra una conciliación nueva | F-07 |
| RN-31 | Cada registro tiene un identificador único y la fecha y hora de creación y de última modificación | F-12, F-13 |

## 4. Ejemplo de cálculo

Datos **ficticios**. Una semana con un solo turno y comisión del 20 % para ambas plataformas.

**Registros**

| Concepto | Valor |
|---|---|
| Carreras Uber con tarjeta | 60.000 |
| Carreras Uber en efectivo | 40.000 |
| Carreras Didi con tarjeta | 30.000 |
| Carreras Didi por Nequi | 20.000 |
| Gasolina | 30.000 |
| Parqueadero | 10.000 |
| Apartado de mantenimiento | 30.000 |
| Lavado (pagado en la semana) | 15.000 |

**Cálculos**

| Concepto | Regla | Cálculo | Resultado |
|---|---|---|---|
| Comisión estimada Uber | RN-11 | 40.000 × 20 % | 8.000 |
| Comisión estimada Didi | RN-11 | 20.000 × 20 % | 4.000 |
| Total trabajado | Glosario | 60.000 + 40.000 + 30.000 + 20.000 | 150.000 |
| Ingreso neto | Glosario | 150.000 − 8.000 − 4.000 | 138.000 |
| Saldo estimado Uber | RN-12 | 60.000 − 8.000 | 52.000 → "Uber te debe 52.000" |
| Saldo estimado Didi | RN-12 | 30.000 − 4.000 | 26.000 → "Didi te debe 26.000" |
| Utilidad del turno | RN-22 | 138.000 − 30.000 − 10.000 | 98.000 |
| Sobre de gastos | RN-25 | 30.000 + 10.000 + 30.000 | 70.000 |
| Sobre de ganancias | RN-26 | 138.000 − 70.000 | 68.000 |
| Sobrante del sobre de gastos | RN-27 | 70.000 − 40.000 − 15.000 | 15.000 |
| Fondo de mantenimiento | RN-21 | 30.000 − 15.000 | 15.000 |

Con el método actual del cuaderno, el sobre de ganancias sería 150.000 − 70.000 = **80.000**. La diferencia de 12.000 son las comisiones de las carreras en efectivo y Nequi, que el conductor le debe a las plataformas. Ver D-01.

## 5. Decisiones pendientes

| ID | Decisión | Opciones | Recomendación |
|---|---|---|---|
| D-01 | ¿El sobre de ganancias se calcula sobre el total trabajado (como el cuaderno) o sobre el ingreso neto? | A) Total trabajado: coincide con el cuaderno, pero infla la ganancia. B) Ingreso neto: refleja lo que de verdad queda | **Decidida: B**, mostrando también el cálculo del cuaderno como referencia (2026-11-21) |
| D-02 | El parqueadero, ¿sale del sobre de gastos? | A) Sí, como gasto operativo (RN-27). B) No, como hoy en el cuaderno | **A**, pendiente de que el conductor explique por qué hoy no lo resta (S-07) |
| D-03 | Porcentaje de comisión por defecto | A) 15 %. B) 17,5 % (punto medio). C) 20 % | **Decidida: C**. Es mejor que el corte muestre más dinero del estimado que menos (2026-11-21) |
| D-04 | Liquidación mensual cuando una semana cruza el cambio de mes | A) Por fecha de cada turno (RN-28). B) Por semanas completas, asignando la semana al mes donde empieza | **Decidida: A** (2026-11-21) |

## 6. Supuestos

Se mantienen los supuestos S-01 a S-08 del documento 01. Se agregan:

| ID | Supuesto | Cómo se valida |
|---|---|---|
| S-09 | Las plataformas cobran comisión sobre los pagos por Nequi igual que sobre el efectivo | Prueba de campo |
| S-10 | Lo que sobra del dinero apartado para mantenimiento no se guarda para el mes siguiente: al cerrar el mes pasa a las ganancias del mes | Supuesto (Sergio); pregunta al conductor |

## 7. Preguntas para el cliente

1. Cuando al final del mes le sobra plata de lo que apartó para mantenimiento, ¿qué hace con ella: la guarda para el mes siguiente o la cuenta como ganancia? (S-10)
2. Al hacer la liquidación de la semana, ¿cómo maneja el parqueadero: lo descuenta de la plata de gastos o lo paga de otra forma? (S-07, D-02)

## 8. Aprobación

| Rol | Nombre | Fecha | Medio |
|---|---|---|---|
| Cliente | | | |
| Desarrollador | Sergio Alexander Sepúlveda Alvarado | 2026-11-21 | Revisión del documento |
