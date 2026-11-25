# 06 — Decisiones de arquitectura (ADR)

| Campo | Valor |
|---|---|
| Proyecto | App de contabilidad para conductor de plataformas de transporte (nombre por definir) |
| Versión | 0.1 |
| Fecha | 2026-11-24 |
| Autor | Sergio Alexander Sepúlveda Alvarado |
| Estado | En revisión |
| Documentos base | [01](01-vision-y-alcance.md) v0.3 · [02](02-glosario-y-reglas-de-negocio.md) v0.3 · [03](03-historias-de-usuario.md) v0.2 |

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 2026-11-24 | Primer borrador: ADR-001 a ADR-005 |

---

## 1. Propósito y formato

Este documento registra las decisiones de arquitectura con su contexto, las opciones evaluadas y sus consecuencias, en el formato de *Architecture Decision Record* (ADR). Una decisión aceptada no se edita: si cambia, se escribe un ADR nuevo que la reemplaza y la anterior pasa a estado "Reemplazada".

| ADR | Decisión | Estado |
|---|---|---|
| ADR-001 | JavaScript puro con módulos ES, sin framework ni compilación | Aceptada |
| ADR-002 | IndexedDB detrás de una capa de repositorio | Aceptada |
| ADR-003 | CSS propio con variables, sin Tailwind | Aceptada |
| ADR-004 | Service worker propio para funcionar sin conexión | Aceptada |
| ADR-005 | Base de seguridad del cliente | Aceptada |

---

## ADR-001 — JavaScript puro con módulos ES, sin framework ni compilación

**Contexto.** La v1 tiene 17 historias de usuario y reglas de cálculo (documento 02) que deben probarse automáticamente (RNF-10). Las instrucciones iniciales del proyecto pedían un solo archivo HTML. Los requisitos RNF-12 y RNF-15 limitan las dependencias de terceros.

**Opciones evaluadas.**

| Opción | Evaluación |
|---|---|
| Un solo archivo HTML | Simple al inicio, pero mezcla reglas, datos e interfaz; impide probar las reglas por separado e incumple RNF-17 |
| **Módulos ES nativos en varios archivos, sin compilación** | Cero dependencias; las reglas se prueban con el probador incluido en Node; GitHub Pages publica los archivos tal cual |
| Framework (React, Vue u otro) | Agrega dependencias y un paso de compilación que no se justifican para una aplicación de este tamaño |

**Decisión.** Módulos ES nativos, separados en tres capas:

```
index.html
manifest.webmanifest
sw.js                     Service worker (ADR-004)
css/app.css               Estilos (ADR-003)
js/app.js                 Punto de entrada
js/dominio/               Reglas del documento 02. Funciones puras: sin DOM ni almacenamiento
js/datos/                 Capa de repositorio sobre IndexedDB (ADR-002)
js/ui/                    Pantallas y componentes de interfaz
tests/                    Pruebas automatizadas de js/dominio
icons/                    Íconos de la PWA
```

Reglas de dependencia entre capas: `ui` puede usar `dominio` y `datos`; `datos` puede usar `dominio`; `dominio` no usa ninguna otra capa.

**Consecuencias.**
- Las reglas de negocio se prueban con `node --test`, sin instalar paquetes. Requiere Node LTS en el equipo del desarrollador.
- Los módulos ES no funcionan abriendo `index.html` directamente desde el disco: en desarrollo se usa un servidor estático local.
- Los montos se formatean con `Intl.NumberFormat("es-CO")`, nativo del navegador.
- Si la aplicación crece mucho, migrar a un framework exige un ADR nuevo.

---

## ADR-002 — IndexedDB detrás de una capa de repositorio

**Contexto.** Los datos viven solo en el celular (documento 01). Un registro debe guardarse completo o no guardarse (RNF-09), y el almacenamiento debe poder reemplazarse por uno en la nube en la fase 2 (RNF-17).

**Opciones evaluadas.**

| Opción | Evaluación |
|---|---|
| localStorage | Fácil, pero síncrono, de poca capacidad, solo guarda texto y no tiene transacciones |
| **IndexedDB nativo** | Transaccional, asíncrono y con capacidad para años de registros |
| IndexedDB con una librería auxiliar | Menos código, pero agrega una dependencia |

**Decisión.** IndexedDB nativo, accedido únicamente a través de `js/datos/`. Ninguna otra capa usa IndexedDB directamente.

Reglas de datos:
- Cada registro tiene un identificador generado con `crypto.randomUUID()`, un campo de usuario (fijo en la v1) y las fechas de creación y modificación (RN-31).
- Los montos se guardan como enteros en COP. Nunca se usan decimales para dinero.
- Las fechas y horas se guardan en formato ISO 8601. La fecha de negocio (RN-03) se calcula en la zona horaria de Colombia.
- El esquema tiene número de versión y las migraciones se hacen en el evento de actualización de la base de datos.
- Al iniciar, el sistema solicita almacenamiento persistente al navegador para reducir el riesgo de que borre los datos.

**Consecuencias.**
- En la fase 2 basta con escribir otra implementación de `js/datos/` con la misma interfaz.
- La solicitud de almacenamiento persistente no está garantizada; el respaldo (HU-15) sigue siendo la protección principal contra la pérdida de datos (R-01).

---

## ADR-003 — CSS propio con variables, sin Tailwind

**Contexto.** Las instrucciones iniciales pedían Tailwind por CDN. Su CDN de desarrollo está pensado para prototipos, no para producción, y carga código de un tercero en tiempo de ejecución, lo que incumple RNF-12. La aplicación tiene pocas pantallas.

**Opciones evaluadas.**

| Opción | Evaluación |
|---|---|
| Tailwind por CDN | Incumple RNF-12 y depende de internet al cargar |
| Tailwind compilado | Cumple RNF-12, pero agrega un paso de compilación y una dependencia |
| **CSS propio con variables** | Cero dependencias; suficiente para pocas pantallas |

**Decisión.** Un archivo `css/app.css` con variables CSS para colores, espacios y tamaños. Tema claro por defecto (RNF-19). Tipografía del sistema, sin fuentes externas. Tamaño mínimo de elementos tocables: 48 × 48 dp con 8 dp de separación (RNF-03).

**Consecuencias.** Más CSS escrito a mano. Las variables permiten agregar un tema oscuro después sin reescribir estilos.

---

## ADR-004 — Service worker propio para funcionar sin conexión

**Contexto.** Todas las funcionalidades deben funcionar sin conexión (RNF-07, HU-17) y la aplicación debe poder actualizarse sin perder datos.

**Opciones evaluadas.**

| Opción | Evaluación |
|---|---|
| **Service worker escrito a mano** | Pocos archivos que cachear; sin dependencias |
| Librería de service workers | Útil en aplicaciones grandes; aquí agrega una dependencia sin necesidad |

**Decisión.** `sw.js` precachea todos los archivos de la aplicación al instalarse y los sirve desde la caché primero. El nombre de la caché incluye la versión de la aplicación; al publicar una versión nueva se cambia y el service worker borra las cachés anteriores. El service worker nunca toca IndexedDB.

**Consecuencias.** Cada publicación debe actualizar la versión de la caché; si se olvida, el celular sigue mostrando la versión anterior. Se agregará una verificación a la lista de publicación.

---

## ADR-005 — Base de seguridad del cliente

**Contexto.** La aplicación no tiene servidor ni login en la v1, por lo que los riesgos principales están en el navegador: ejecución de código inyectado, dependencias comprometidas, inyección de fórmulas al exportar y pérdida de datos. El proyecto se alinea con OWASP ASVS nivel 1 y con controles de referencia del Anexo A de ISO/IEC 27001.

**Decisión.**

| Control | Cómo se aplica | Requisito |
|---|---|---|
| Política de seguridad de contenido (CSP) | Etiqueta `meta` en `index.html` (GitHub Pages no permite configurar cabeceras): solo recursos del mismo origen, sin scripts en línea, sin `eval`, `object-src 'none'` | RNF-13 |
| Salida segura | Los datos del usuario se insertan en la página con `textContent`, nunca con `innerHTML` | RNF-11 |
| Validación de entrada | Tipo, rango y longitud en la capa `dominio`, antes de guardar | RNF-11 |
| Cero dependencias en tiempo de ejecución | Todo se sirve desde el mismo origen; sin CDN, analítica ni fuentes externas | RNF-12, RNF-16 |
| Exportación CSV segura | Neutraliza los valores que empiezan por `=`, `+`, `-` o `@` | HU-14 |
| Restauración segura | El archivo de respaldo se valida completo antes de reemplazar cualquier dato | HU-15 |
| HTTPS | Publicación en GitHub Pages con HTTPS obligatorio | RNF-14 |
| Repositorio | Alertas de dependencias, escaneo de secretos y revisión por pull request | RNF-15 |

**Consecuencias.** La CSP en `meta` no admite todas las directivas (por ejemplo, `frame-ancestors`); se acepta esa limitación por publicar en GitHub Pages. El mapeo detallado a ASVS y al Anexo A va en el documento 07.

---

## 2. Aprobación

| Rol | Nombre | Fecha | Medio |
|---|---|---|---|
| Desarrollador | Sergio Alexander Sepúlveda Alvarado | | |

## Referencias

- Nygard, M. (2011). *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- MDN Web Docs. *IndexedDB API*. https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN Web Docs. *Service Worker API*. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- MDN Web Docs. *Content Security Policy (CSP)*. https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- Node.js. *Test runner*. https://nodejs.org/api/test.html
- Tailwind CSS. *Play CDN*. https://tailwindcss.com/docs/installation/play-cdn
- OWASP. *CSV Injection*. https://owasp.org/www-community/attacks/CSV_Injection
