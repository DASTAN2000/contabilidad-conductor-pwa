# CLAUDE.md

Instrucciones para Claude Code en este repositorio.

## Proyecto

PWA mobile-first y offline para que un conductor que trabaja con Uber y Didi a la vez registre sus carreras, gastos y liquidaciones, reemplazando un cuaderno. Proyecto de portafolio de Sergio Sepúlveda (estudiante de Ingeniería de Software), llevado con un proceso profesional: documentación antes del código.

La fuente de verdad de los requerimientos es `docs/`. Lee `docs/01-vision-y-alcance.md` antes de proponer cualquier cambio.

## Estado actual

- Fase: **requerimientos → arquitectura**. Aprobados: `01-vision-y-alcance.md` (v0.3), `02-glosario-y-reglas-de-negocio.md` (v0.3) y `03-historias-de-usuario.md` (v0.2).
- Los términos y reglas de `02` (IDs RN-xx) son obligatorios: usa sus nombres exactos en código, interfaz y pruebas.
- Arquitectura: `06-decisiones-de-arquitectura.md` (ADR-001 a ADR-005). Respétala; cambiarla exige un ADR nuevo.
- Siguiente: la prueba de concepto (incremento 0 del documento 03). Los documentos 04, 05, 07 y 08 van después de la prueba de concepto.
- **No escribas código de la aplicación** hasta que Sergio lo apruebe explícitamente. La excepción prevista es la prueba de concepto de captura (página mínima para cronometrar el registro de una carrera), cuando él la pida.

## Decisiones tomadas

- Arquitectura local primero: datos solo en el dispositivo, sin servidor. Preparada para una futura fase con nube: identificadores únicos por registro, campo de usuario y una capa de acceso a datos reemplazable.
- Publicación en GitHub Pages. Costo de operación $0.
- Plataforma objetivo: Android con Chrome.
- La plataforma (Uber o Didi) se registra por carrera, no por turno.
- La comisión es variable (el cliente la estima entre 15 % y 20 %). Nunca usar un porcentaje fijo como verdad: el saldo de cada plataforma se estima y se concilia con el saldo real que muestra la plataforma.
- Dos ciclos independientes y configurables: liquidación personal (lunes a domingo por defecto) y corte de plataforma (martes por defecto).
- Captura rápida con teclado numérico; el dictado es opcional. Metas: 10 s por carrera y 30 s para cerrar un turno.
- Tema claro por defecto (preferencia del cliente).
- El parqueadero y el mantenimiento son apartados que alimentan el fondo del carro, que se acumula (documento 02, RN-20 y RN-21).
- JavaScript puro con módulos ES, sin framework ni compilación; capas `js/dominio` (reglas puras), `js/datos` (IndexedDB) y `js/ui` (ADR-001).
- IndexedDB nativo solo a través de `js/datos`; montos como enteros COP; IDs con `crypto.randomUUID()` (ADR-002).
- CSS propio con variables; sin Tailwind ni fuentes externas (ADR-003).
- Service worker propio, caché versionada (ADR-004).
- Pruebas de `js/dominio` con `node --test`, sin paquetes.

## Seguridad

- Alinear el diseño con OWASP ASVS nivel 1 (requisitos aplicables), gestión de riesgos según ISO 31000 y controles de referencia del Anexo A de ISO/IEC 27001. Se dice "alineado con", nunca "cumple" o "certificado".
- **Nunca** subir al repositorio datos reales del cliente (montos, capturas, fotos del cuaderno, nombres). Los casos de prueba usan datos ficticios o anonimizados.
- No agregar dependencias de terceros sin justificarlas. Revisar el código de cualquier plugin o paquete de terceros antes de usarlo.
- CSP en `meta`, sin scripts en línea ni `eval`; insertar datos del usuario solo con `textContent`, nunca `innerHTML` (ADR-005).

## Convenciones

- Documentación y textos de la interfaz en español; README en español e inglés.
- Usar comillas rectas "" y nunca comillas angulares «».
- Moneda: pesos colombianos (COP), sin decimales, separador de miles con punto.
- Commits con Conventional Commits en español (ej. `docs: agrega reglas de negocio`, `feat: registro de carreras`).
- Trabajo en ramas y pull requests; no hacer commits directos a `main`.
- Los documentos en `docs/` se numeran (`01-`, `02-`…) y llevan tabla de versión, historial y sección de aprobación.
- Referencias solo reales y verificables.

## Cómo trabajar con Sergio

- Es el desarrollador y está aprendiendo: explica las decisiones y, cuando haya opciones, da varias con una recomendada y por qué.
- Respuestas cortas, directas y críticas: si algo está mal o es mejorable, dilo.
- Cerrar los entregables de uno en uno.
