# 03 — Historias de usuario y requerimientos no funcionales

| Campo | Valor |
|---|---|
| Proyecto | App de contabilidad para conductor de plataformas de transporte (nombre por definir) |
| Versión | 0.2 |
| Fecha | 2026-11-24 |
| Autor | Sergio Alexander Sepúlveda Alvarado |
| Estado | Aprobada por el desarrollador |
| Documentos base | [01 — Visión y alcance](01-vision-y-alcance.md) v0.3 · [02 — Glosario y reglas de negocio](02-glosario-y-reglas-de-negocio.md) v0.3 |

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 2026-11-21 | Primer borrador |
| 0.2 | 2026-11-24 | Ajustes por la ronda 3: el parqueadero es apartado, fondo del carro acumulado, tema claro (RNF-19). Referencia de objetivos táctiles verificada |

---

## 1. Propósito y formato

Este documento traduce el alcance (01) y las reglas (02) en requisitos verificables. Cada historia sigue el formato:

> **Como** conductor **quiero** [acción] **para** [beneficio].

Cada historia tiene:
- **Criterios de aceptación** en formato *Dado / Cuando / Entonces*. Una historia está terminada solo si todos sus criterios se cumplen.
- **Prioridad** según MoSCoW: **M** (debe tener), **S** (debería tener), **C** (podría tener).
- **Trazabilidad** a las funcionalidades (F-xx) del documento 01 y a las reglas (RN-xx) del documento 02.

Los términos en cursiva están definidos en el glosario del documento 02.

El único rol de la v1 es el **conductor**.

---

## 2. Historias de usuario

### Épica E1 — Turnos

#### HU-01 Iniciar un turno · M

**Como** conductor **quiero** iniciar un turno con un toque **para** empezar a registrar carreras sin perder tiempo.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** que no hay un turno abierto, **cuando** toco "Iniciar turno", **entonces** el sistema crea el turno con la fecha y hora actuales como inicio |
| 2 | **Dado** que existe un turno anterior, **cuando** inicio un turno, **entonces** el km inicial aparece sugerido con el km final del turno anterior y lo puedo cambiar |
| 3 | **Dado** que escribo un km inicial mayor que el km final del turno anterior, **cuando** guardo, **entonces** la diferencia queda registrada como *km fuera de turno* |
| 4 | **Dado** que ya hay un turno abierto, **cuando** intento iniciar otro, **entonces** el sistema no lo permite y me ofrece ir al turno abierto |
| 5 | **Dado** que olvidé iniciar el turno a tiempo, **cuando** lo inicio, **entonces** puedo corregir la hora de inicio |

Trazabilidad: F-01 · RN-01, RN-03, RN-04, RN-05

#### HU-02 Cerrar un turno · M

**Como** conductor **quiero** cerrar el turno anotando el km final, la gasolina y los apartados **para** dejar el día cuadrado en menos de 30 segundos.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un turno abierto, **cuando** toco "Cerrar turno", **entonces** el sistema toma la hora actual como fin (editable) y me pide el km final |
| 2 | **Dado** que escribo un km final menor que el km inicial, **cuando** intento guardar, **entonces** el sistema lo rechaza y explica por qué |
| 3 | **Dado** que estoy cerrando el turno, **cuando** llego al paso de gastos, **entonces** puedo registrar la gasolina sin salir de la pantalla de cierre |
| 4 | **Dado** que estoy cerrando el turno, **cuando** llego a los apartados, **entonces** aparecen sugeridos los últimos valores de mantenimiento y de parqueadero, y puedo cambiarlos o dejarlos en 0 |
| 5 | **Dado** que terminé el cierre, **cuando** guardo, **entonces** veo un resumen del turno: carreras, total trabajado, ingreso neto, gastos, utilidad, horas y km |
| 6 | **Dado** un conductor que ya conoce el sistema, **cuando** cierra un turno con km final, la gasolina y los apartados sugeridos, **entonces** lo completa en 30 segundos o menos (OBJ-02) |

Trazabilidad: F-01, F-03, F-04, F-11 · RN-01, RN-02, RN-20, RN-22

#### HU-03 Corregir o eliminar un turno · M

**Como** conductor **quiero** corregir o eliminar un turno **para** arreglar errores sin dañar mis cuentas.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un turno cerrado, **cuando** cambio cualquiera de sus datos, **entonces** el sistema recalcula saldos, indicadores y liquidaciones |
| 2 | **Dado** que elijo eliminar un turno, **cuando** confirmo, **entonces** se eliminan el turno y sus carreras; antes de confirmar el sistema me dice cuántas carreras se eliminarán |
| 3 | **Dado** que elijo eliminar, **cuando** cancelo la confirmación, **entonces** no se elimina nada |

Trazabilidad: F-01 · RN-29

### Épica E2 — Carreras

#### HU-04 Registrar una carrera · M

**Como** conductor **quiero** registrar una carrera en pocos segundos **para** anotar todas sin que me quite tiempo entre viajes.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un turno abierto, **cuando** abro el registro de carrera, **entonces** aparece el teclado numérico listo para escribir el monto, sin tener que tocar el campo |
| 2 | **Dado** que ya registré carreras, **cuando** abro el registro, **entonces** la plataforma y el medio de pago aparecen preseleccionados con los de la última carrera |
| 3 | **Dado** que escribí el monto, **cuando** cambio la plataforma o el medio de pago, **entonces** cada cambio requiere un solo toque |
| 4 | **Dado** que guardo la carrera, **cuando** se registra, **entonces** veo una confirmación breve con monto, plataforma y medio de pago, y el saldo estimado de esa plataforma se actualiza |
| 5 | **Dado** que escribo un monto mayor al límite de verificación, **cuando** intento guardar, **entonces** el sistema me pide confirmar el valor |
| 6 | **Dado** que escribo 0 o dejo el monto vacío, **cuando** intento guardar, **entonces** el sistema no lo permite |
| 7 | **Dado** que no hay un turno abierto, **cuando** intento registrar una carrera, **entonces** el sistema me ofrece iniciar un turno |
| 8 | **Dado** un conductor que ya conoce el sistema, **cuando** registra una carrera sin cambiar plataforma ni medio, **entonces** lo completa en 10 segundos o menos (OBJ-01) |

Trazabilidad: F-02, F-05, F-06 · RN-05, RN-06, RN-07, RN-08, RN-09, RN-11

#### HU-05 Dictar el monto de una carrera · C

**Como** conductor **quiero** dictar el monto con el micrófono del teclado **para** registrar sin escribir.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** que dicto el monto con el micrófono del teclado, **cuando** el texto llega como "15000", "15.000", "15 mil" o "quince mil", **entonces** el sistema lo interpreta como 15.000 |
| 2 | **Dado** que el sistema no puede interpretar lo dictado, **cuando** intento guardar, **entonces** me lo indica y no guarda |

Trazabilidad: F-05 · RN-06

#### HU-06 Ver y corregir las carreras del turno · M

**Como** conductor **quiero** ver la lista de carreras del turno y corregir cualquiera **para** arreglar un error de inmediato.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un turno con carreras, **cuando** abro el turno, **entonces** veo las carreras de la más reciente a la más antigua, con monto, plataforma, medio de pago y hora |
| 2 | **Dado** una carrera, **cuando** la edito o la elimino (con confirmación), **entonces** los totales y el saldo estimado se recalculan |
| 3 | **Dado** el turno abierto, **cuando** lo veo, **entonces** se muestran los totales por plataforma y por medio de pago |

Trazabilidad: F-02 · RN-29

### Épica E3 — Gastos

#### HU-07 Registrar un gasto · M

**Como** conductor **quiero** registrar un gasto en cualquier momento **para** no depender del cierre del turno.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** que registro un gasto, **cuando** elijo la categoría, **entonces** puedo escoger entre gasolina, parqueadero pagado, lavado y mantenimiento realizado |
| 2 | **Dado** que hay un turno abierto, **cuando** registro un gasto, **entonces** queda asociado a ese turno por defecto y puedo quitar la asociación |
| 3 | **Dado** que no hay turno abierto, **cuando** registro un gasto, **entonces** queda con la fecha actual (editable) y sin turno |
| 4 | **Dado** que registro un parqueadero pagado, un lavado o un mantenimiento realizado, **cuando** guardo, **entonces** el *fondo del carro* se reduce en ese valor |
| 5 | **Dado** que el fondo del carro queda negativo, **cuando** guardo, **entonces** el sistema me lo advierte |

Trazabilidad: F-03, F-04 · RN-18, RN-19, RN-21

### Épica E4 — Cuentas con las plataformas

#### HU-08 Ver el saldo de cada plataforma · M

**Como** conductor **quiero** ver en todo momento cuánto me debe cada plataforma o cuánto le debo **para** no tener que descifrar el resumen de las aplicaciones.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** cualquier momento, **cuando** abro la pantalla principal, **entonces** veo el *saldo estimado* de Uber y de Didi por separado |
| 2 | **Dado** un saldo positivo, **cuando** lo veo, **entonces** el texto dice "Uber te debe X"; **dado** un saldo negativo, dice "Debes consignar X a Didi" |
| 3 | **Dado** que hubo una conciliación, **cuando** veo el saldo, **entonces** se indica la fecha de la última conciliación |
| 4 | **Dado** un saldo estimado, **cuando** lo veo, **entonces** se distingue visualmente de un saldo real conciliado |

Trazabilidad: F-06 · RN-10, RN-11, RN-12, RN-13, RN-15

#### HU-09 Conciliar con el saldo real · M

**Como** conductor **quiero** escribir el saldo que me muestra Uber o Didi **para** que el sistema corrija su estimación.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** una plataforma, **cuando** registro su *saldo real*, **entonces** el sistema guarda la fecha y hora, el saldo real, el saldo estimado y la *diferencia de conciliación* |
| 2 | **Dado** que concilié, **cuando** registro nuevas carreras, **entonces** el saldo estimado parte del saldo real conciliado |
| 3 | **Dado** que me equivoqué en una conciliación, **cuando** quiero corregirla, **entonces** registro una conciliación nueva; la anterior no se edita |
| 4 | **Dado** varias conciliaciones, **cuando** las consulto, **entonces** veo el historial con sus diferencias |

Trazabilidad: F-07 · RN-13, RN-14, RN-30

#### HU-10 Registrar el corte: depósito o consignación · M

**Como** conductor **quiero** registrar el depósito o la consignación del corte **para** que el saldo de cada plataforma quede al día.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** el día de corte de una plataforma, **cuando** abro el sistema, **entonces** veo un aviso para registrar el depósito o la consignación de esa plataforma |
| 2 | **Dado** que registro un depósito, **cuando** guardo, **entonces** el saldo de la plataforma baja en ese valor |
| 3 | **Dado** que registro una consignación, **cuando** guardo, **entonces** el saldo de la plataforma sube en ese valor |
| 4 | **Dado** que registro el corte, **cuando** guardo, **entonces** el sistema me ofrece conciliar con el saldo real en el mismo paso |

Trazabilidad: F-07, F-08 · RN-16, RN-17

### Épica E5 — Liquidaciones e indicadores

#### HU-11 Ver la liquidación semanal · M

**Como** conductor **quiero** ver la liquidación de la semana con mis sobres **para** dejar de calcularla a mano.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** una *semana de liquidación*, **cuando** la abro, **entonces** veo: total trabajado, comisiones estimadas, ingreso neto, *sobre de gastos*, *sobre de ganancias* y *sobrante del sobre de gastos* |
| 2 | **Dado** la liquidación, **cuando** la veo, **entonces** también aparece el sobre de ganancias calculado como en el cuaderno (total trabajado − sobre de gastos), marcado como referencia |
| 3 | **Dado** la liquidación, **cuando** la veo, **entonces** puedo ver el detalle por turno y por plataforma |
| 4 | **Dado** la semana en curso, **cuando** la abro, **entonces** los valores se muestran como parciales hasta que termine la semana |
| 5 | **Dado** los datos del ejemplo de la sección 4 del documento 02, **cuando** calculo la liquidación, **entonces** obtengo exactamente los resultados de ese ejemplo |

Trazabilidad: F-09 · RN-24, RN-25, RN-26, RN-27

#### HU-12 Ver la liquidación mensual · M

**Como** conductor **quiero** ver la liquidación del mes **para** saber cuánto gané realmente en el mes.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un mes, **cuando** abro su liquidación, **entonces** veo los mismos conceptos de la semanal, sumando los turnos y gastos con fecha dentro del mes |
| 2 | **Dado** un mes, **cuando** veo su liquidación, **entonces** aparece el saldo del fondo del carro al cierre del mes, que se acumula para el mes siguiente |
| 3 | **Dado** una semana que cruza dos meses, **cuando** veo cada mes, **entonces** cada turno cuenta solo en el mes de su fecha |

Trazabilidad: F-10 · RN-21, RN-28

#### HU-13 Ver indicadores del turno · S

**Como** conductor **quiero** ver cuánto gané por hora y por km **para** decidir cuándo y cuánto me conviene trabajar.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un turno cerrado, **cuando** veo su resumen, **entonces** aparecen la utilidad, la utilidad por hora y la utilidad por km |
| 2 | **Dado** un turno sin km recorrido o sin duración, **cuando** veo su resumen, **entonces** el indicador correspondiente no se muestra |
| 3 | **Dado** una semana o un mes, **cuando** veo la liquidación, **entonces** aparecen los mismos indicadores para el periodo |

Trazabilidad: F-11 · RN-22, RN-23

### Épica E6 — Datos y configuración

#### HU-14 Exportar a CSV · M

**Como** conductor **quiero** exportar mis registros a un archivo CSV **para** abrirlos en Excel o compartirlos.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** un rango de fechas, **cuando** exporto, **entonces** obtengo archivos CSV de turnos, carreras, gastos, apartados, conciliaciones y cortes |
| 2 | **Dado** un CSV exportado, **cuando** lo abro en Excel con configuración regional de Colombia, **entonces** las tildes y los montos se ven correctamente |
| 3 | **Dado** un valor de texto que empieza por `=`, `+`, `-` o `@`, **cuando** exporto, **entonces** se neutraliza para que Excel no lo ejecute como fórmula |

Trazabilidad: F-12 · RN-31

#### HU-15 Respaldar y restaurar · M

**Como** conductor **quiero** hacer una copia de seguridad y restaurarla **para** no perder mis datos si cambio o pierdo el celular.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** cualquier momento, **cuando** toco "Respaldar", **entonces** se descarga un archivo con todos los datos y la configuración, con la fecha en el nombre |
| 2 | **Dado** un archivo de respaldo, **cuando** lo restauro, **entonces** el sistema me advierte que reemplazará los datos actuales y pide confirmación |
| 3 | **Dado** un archivo dañado o que no es un respaldo del sistema, **cuando** intento restaurarlo, **entonces** el sistema lo rechaza sin modificar los datos actuales |
| 4 | **Dado** que pasaron 7 días desde el último respaldo, **cuando** abro el sistema, **entonces** veo un recordatorio para respaldar |

Trazabilidad: F-13 · RN-31

#### HU-16 Configurar el sistema · M

**Como** conductor **quiero** ajustar la configuración **para** que el sistema se adapte a cómo trabajo.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** la configuración, **cuando** la abro, **entonces** puedo cambiar: porcentaje de comisión por plataforma, día de corte por plataforma, día de inicio de la semana de liquidación y límite de verificación de montos |
| 2 | **Dado** la primera vez que uso el sistema, **cuando** lo abro, **entonces** los valores por defecto son: 20 % de comisión, corte el martes, semana de lunes a domingo y límite de 200.000 |
| 3 | **Dado** que cambio el porcentaje de comisión, **cuando** guardo, **entonces** el cambio aplica a las carreras registradas desde ese momento; las anteriores conservan el porcentaje con el que se calcularon |

Trazabilidad: F-06, F-08, F-09 · RN-09, RN-10, RN-17, RN-24

### Épica E7 — Instalación y uso sin conexión

#### HU-17 Instalar y usar sin internet · M

**Como** conductor **quiero** instalar el sistema en el celular y usarlo sin internet **para** registrar aunque no tenga datos móviles.

| # | Criterio de aceptación |
|---|---|
| 1 | **Dado** Chrome en Android, **cuando** abro la dirección del sistema, **entonces** puedo instalarlo en la pantalla de inicio con su propio ícono |
| 2 | **Dado** que el sistema ya se abrió una vez con internet, **cuando** lo abro sin conexión, **entonces** funciona completo |
| 3 | **Dado** que cierro el sistema o apago el celular, **cuando** lo vuelvo a abrir, **entonces** todos mis datos siguen ahí |
| 4 | **Dado** que hay una versión nueva, **cuando** abro el sistema con internet, **entonces** se actualiza sin perder datos |

Trazabilidad: F-14

---

## 3. Requerimientos no funcionales

| ID | Categoría | Requerimiento | Cómo se verifica |
|---|---|---|---|
| RNF-01 | Rendimiento | El sistema abre y queda listo para registrar en menos de 2 segundos en un Android de gama media, ya instalado | Medición en el celular del cliente |
| RNF-02 | Rendimiento | Guardar un registro y ver los totales actualizados no produce espera perceptible | Prueba de campo |
| RNF-03 | Usabilidad | Los elementos tocables miden al menos 48 × 48 dp, con al menos 8 dp de separación, según la guía de accesibilidad de Android | Revisión de diseño |
| RNF-04 | Usabilidad | El texto cumple contraste mínimo de 4,5:1 (WCAG 2.1, nivel AA) | Herramienta de contraste |
| RNF-05 | Usabilidad | Las acciones frecuentes (registrar carrera, ver saldos) están a un toque desde la pantalla principal | Revisión de diseño |
| RNF-06 | Usabilidad | Los textos de la interfaz están en español de Colombia y los montos usan formato COP con punto de miles | Revisión de diseño |
| RNF-07 | Disponibilidad | Todas las funcionalidades de la v1 funcionan sin conexión (HU-17) | Prueba en modo avión |
| RNF-08 | Compatibilidad | Funciona en las dos versiones más recientes de Chrome para Android | Prueba en dispositivo |
| RNF-09 | Integridad de datos | Ninguna operación deja los datos a medias: un registro se guarda completo o no se guarda | Pruebas automatizadas |
| RNF-10 | Integridad de datos | Los cálculos de las reglas RN-11 a RN-28 tienen pruebas automatizadas con datos ficticios, incluido el ejemplo del documento 02 | Ejecución de pruebas |
| RNF-11 | Seguridad | Todo dato ingresado se valida (tipo, rango, longitud) y se muestra en pantalla de forma que no pueda ejecutarse como código | Pruebas y revisión de código |
| RNF-12 | Seguridad | El sistema no carga scripts, estilos ni fuentes desde servidores de terceros en tiempo de ejecución: todo se sirve desde el mismo origen | Revisión de las solicitudes de red |
| RNF-13 | Seguridad | Se aplica una política de seguridad de contenido (CSP) que impide la ejecución de scripts no autorizados | Revisión de cabeceras o meta etiquetas |
| RNF-14 | Seguridad | Se sirve solo por HTTPS (GitHub Pages) | Revisión de la publicación |
| RNF-15 | Seguridad | Cada dependencia de terceros está justificada en un ADR y se revisa en busca de vulnerabilidades conocidas | Revisión del documento 06 y alertas del repositorio |
| RNF-16 | Privacidad | El sistema no envía datos del conductor a ningún servidor ni usa analítica o rastreo | Revisión de las solicitudes de red |
| RNF-17 | Mantenibilidad | El código separa reglas de negocio, almacenamiento e interfaz, de modo que el almacenamiento local pueda reemplazarse por uno en la nube sin reescribir las reglas | Revisión de arquitectura (documento 06) |
| RNF-18 | Mantenibilidad | Los nombres en el código siguen los términos del documento 02 | Revisión de código |
| RNF-19 | Usabilidad | Tema claro por defecto, por preferencia del cliente | Revisión de diseño |

Los requisitos de seguridad RNF-11 a RNF-16 se mapearán a los requisitos aplicables de OWASP ASVS nivel 1 y a los controles de referencia del Anexo A de ISO/IEC 27001 en los documentos 06 y 07.

---

## 4. Plan de entregas

Las historias se agrupan en incrementos. Cada incremento termina con algo que el conductor puede probar.

| Incremento | Contenido | Objetivo |
|---|---|---|
| 0 — Prueba de concepto | Registro de carrera (HU-04, criterios 1 a 4 y 8) en una página mínima | Medir con el conductor si el registro cabe en 10 segundos antes de diseñar todo |
| 1 — Registro | HU-01, HU-02, HU-03, HU-04, HU-06, HU-07, HU-15, HU-17 | Reemplazar la hoja de carreras y la tabla diaria |
| 2 — Plataformas | HU-08, HU-09, HU-10, HU-16 | Saber en todo momento cuánto debe o le deben |
| 3 — Liquidaciones | HU-11, HU-12, HU-13, HU-14 | Reemplazar la hoja de liquidaciones |
| Opcional | HU-05 | Dictado por voz |

El respaldo (HU-15) va en el incremento 1 a propósito: desde el primer día que el conductor use el sistema con datos reales, debe poder protegerlos (R-01).

---

## 5. Matriz de trazabilidad

| Funcionalidad (01) | Historias |
|---|---|
| F-01 Turnos | HU-01, HU-02, HU-03 |
| F-02 Carreras | HU-04, HU-06 |
| F-03 Gastos reales | HU-02, HU-07 |
| F-04 Apartados | HU-02, HU-07 |
| F-05 Captura rápida | HU-04, HU-05 |
| F-06 Saldo estimado | HU-04, HU-08, HU-16 |
| F-07 Conciliación | HU-09, HU-10 |
| F-08 Corte de plataforma | HU-10, HU-16 |
| F-09 Liquidación semanal | HU-11, HU-16 |
| F-10 Liquidación mensual | HU-12 |
| F-11 Indicadores | HU-02, HU-13 |
| F-12 Exportación CSV | HU-14 |
| F-13 Respaldo | HU-15 |
| F-14 PWA sin conexión | HU-17 |

Todas las funcionalidades del alcance tienen al menos una historia.

---

## 6. Aprobación

| Rol | Nombre | Fecha | Medio |
|---|---|---|---|
| Cliente | | | |
| Desarrollador | Sergio Alexander Sepúlveda Alvarado | | |

## Referencias

- Cohn, M. (2004). *User Stories Applied: For Agile Software Development*. Addison-Wesley.
- W3C (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*, criterio 1.4.3 Contraste (mínimo). https://www.w3.org/TR/WCAG21/
- Google. *Android Accessibility Help — Touch target size*. https://support.google.com/accessibility/android/answer/7101858
- OWASP. *CSV Injection*. https://owasp.org/www-community/attacks/CSV_Injection
- OWASP. *Application Security Verification Standard (ASVS)*. https://owasp.org/www-project-application-security-verification-standard/
