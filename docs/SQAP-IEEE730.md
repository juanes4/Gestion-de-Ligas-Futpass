# Plan de Aseguramiento de la Calidad del Software (SQAP)
**Conforme a IEEE Std 730-2014**

| Campo | Detalle |
|---|---|
| **Proyecto** | FootPass — Sistema de Gestión de Ligas de Fútbol |
| **Versión del documento** | 1.0 |
| **Fecha de emisión** | 2026-05-19 |
| **Sprint** | Sprint 3 |
| **Estado** | Activo |
| **Rama principal** | `main` |
| **Rama de desarrollo** | `Juanes` |

---

## Tabla de contenido

1. [Propósito](#1-propósito)
2. [Documentos de referencia](#2-documentos-de-referencia)
3. [Gestión](#3-gestión)
4. [Documentación](#4-documentación)
5. [Estándares, prácticas, convenciones y métricas](#5-estándares-prácticas-convenciones-y-métricas)
6. [Revisiones y auditorías](#6-revisiones-y-auditorías)
7. [Pruebas](#7-pruebas)
8. [Reporte de problemas y acciones correctivas](#8-reporte-de-problemas-y-acciones-correctivas)
9. [Herramientas, técnicas y metodologías](#9-herramientas-técnicas-y-metodologías)
10. [Control de código](#10-control-de-código)
11. [Control de medios](#11-control-de-medios)
12. [Control de proveedores](#12-control-de-proveedores)
13. [Recolección, mantenimiento y retención de registros](#13-recolección-mantenimiento-y-retención-de-registros)
14. [Capacitación](#14-capacitación)
15. [Gestión de riesgos](#15-gestión-de-riesgos)

---

## 1. Propósito

### 1.1 Alcance del plan

Este Plan de Aseguramiento de la Calidad del Software (SQAP) rige todas las actividades de calidad del proyecto **FootPass**, un sistema web de gestión de ligas de fútbol compuesto por:

- **Frontend**: aplicación Next.js 16 / React 19 con TypeScript y Tailwind CSS.
- **Backend**: API REST en Python/Flask con base de datos SQLite.
- **Funcionalidades cubiertas**: autenticación de administradores, gestión de equipos, jugadores y ligas, programación de partidos (round-robin), registro de resultados, cálculo de clasificaciones e importación masiva CSV/Excel.

### 1.2 Objetivo

Garantizar que el software entregado al final de cada sprint cumpla los requisitos funcionales, de seguridad, mantenibilidad y rendimiento definidos, mediante actividades planificadas y sistemáticas de aseguramiento de calidad.

### 1.3 Límites

Este plan no cubre:
- Infraestructura de producción (despliegue en la nube).
- Calidad de hardware ni redes externas.
- Aspectos de calidad de datos precargados en la base de datos de semilla (`seed_players.py`).

---

## 2. Documentos de referencia

| # | Documento | Ubicación |
|---|---|---|
| R1 | IEEE Std 730-2014 — Software Quality Assurance | Estándar IEEE |
| R2 | IEEE Std 829-2008 — Software Test Documentation | Estándar IEEE |
| R3 | IEEE Std 1028-2008 — Software Reviews and Audits | Estándar IEEE |
| R4 | Historias de usuario refinadas del Sprint 3 | `docs/historias-usuario-refinadas.md` |
| R5 | Historias de usuario originales | `docs/historias-usuario.md` |
| R6 | Definición del esquema de base de datos | `backend/src/database.py` |
| R7 | Rutas de la API REST | `backend/src/routes.py` |
| R8 | Lógica de negocio (standings, scheduling) | `backend/src/services.py` |
| R9 | OWASP Top 10 (2021) | https://owasp.org/Top10/ |
| R10 | PEP 8 — Python Style Guide | https://peps.python.org/pep-0008/ |
| R11 | Guía de estilo de Airbnb para TypeScript/React | Referencia del equipo |

---

## 3. Gestión

### 3.1 Organización

El proyecto es desarrollado por un equipo universitario bajo la materia **Calidad de Software**, Semestre 8. Las responsabilidades de calidad se distribuyen así:

| Rol | Responsabilidad principal |
|---|---|
| **Líder de QA** | Elaborar y mantener este SQAP; coordinar revisiones; gestionar el registro de defectos. |
| **Desarrolladores** | Implementar código conforme a los estándares; ejecutar pruebas unitarias; corregir defectos asignados. |
| **Revisor de código (peer)** | Realizar revisiones de código antes de cada merge a `main`. |
| **Tester funcional** | Ejecutar casos de prueba de aceptación por sprint; reportar hallazgos. |

### 3.2 Tareas de aseguramiento de calidad

Las actividades de QA por sprint son:

| Actividad | Frecuencia | Responsable |
|---|---|---|
| Revisión de requisitos (HUs) | Al inicio de cada sprint | Líder de QA + equipo |
| Revisión de código (pull request) | Antes de cada merge | Revisor de código |
| Ejecución de pruebas funcionales | Antes de cierre de sprint | Tester funcional |
| Revisión de seguridad básica | Una vez por sprint | Líder de QA |
| Actualización de métricas de calidad | Al cierre de sprint | Líder de QA |
| Auditoría interna de proceso | Al final de cada sprint | Líder de QA |

### 3.3 Responsabilidades adicionales

- Los desarrolladores no aprueban sus propios pull requests.
- Cualquier defecto clasificado como **Crítico** o **Alto** bloquea el cierre del sprint hasta su resolución.
- Las decisiones de aceptar un gap de calidad (ej. deuda técnica documentada en los TODOs de las HUs) deben ser aprobadas explícitamente por el Líder de QA y quedar registradas.

---

## 4. Documentación

### 4.1 Documentos requeridos por el proyecto

| Documento | Propósito | Estado actual |
|---|---|---|
| Este SQAP | Definir el plan de calidad completo | Emitido v1.0 |
| Historias de Usuario Refinadas | Especificación funcional del sprint | Emitido (`docs/historias-usuario-refinadas.md`) |
| Historias de Usuario Originales | Backlog inicial | Emitido (`docs/historias-usuario.md`) |
| Plan de Pruebas | Detallar estrategia, casos y criterios de prueba | Pendiente de elaboración |
| Registro de Defectos | Trazabilidad de errores y su resolución | Pendiente — ver sección 8 |
| Informe de Métricas por Sprint | Resultados cuantitativos de calidad | Pendiente — ver sección 5.3 |

### 4.2 Criterios de calidad de la documentación

- Toda HU debe tener al menos un escenario de happy path y uno de no-happy path antes de comenzar la implementación.
- Los mensajes de UI citados en los escenarios Gherkin deben coincidir exactamente con los strings en el código fuente.
- Los gaps de producto documentados (sección "Gaps reales del producto" de las HUs) deben tener un ID único y ser trazables a una decisión formal de aceptación o corrección.

---

## 5. Estándares, prácticas, convenciones y métricas

### 5.1 Estándares de codificación

#### Backend (Python/Flask)

| Ítem | Estándar / Convención |
|---|---|
| Estilo de código | PEP 8 — líneas ≤ 88 caracteres (compatible con Black) |
| Consultas SQL | Siempre usar parámetros posicionales `?` — nunca interpolación de strings |
| Manejo de conexiones | Abrir y cerrar `conn` dentro de cada función; usar `try/finally` |
| Validación de entrada | Verificar campos requeridos antes de operar en DB; retornar HTTP 400 con mensaje descriptivo |
| Hashing de contraseñas | `bcrypt` con `gensalt()` — nunca almacenar contraseñas en texto plano |
| Respuestas de error | JSON con clave `"error"` y código HTTP apropiado (400, 401, 404, 409, 500) |

#### Frontend (TypeScript/React/Next.js)

| Ítem | Estándar / Convención |
|---|---|
| Tipado | TypeScript estricto; evitar `any` salvo en bloques `catch` excepcionales |
| Componentes | Funcionales con hooks; no usar class components |
| Formularios | Usar `react-hook-form` + `zod` para validación |
| Estado de sesión | `sessionStorage` bajo la clave `"userSession"` |
| Llamadas API | `fetch` con manejo de errores explícito; no dejar `catch` vacíos en flujos visibles al usuario |
| Nombres | camelCase para variables/funciones; PascalCase para componentes y tipos |

### 5.2 Prácticas de desarrollo

- **No commit directo a `main`**: todo cambio pasa por pull request con al menos una revisión aprobada.
- **Commits atómicos**: cada commit representa un cambio coherente y deployable.
- **Mensajes de commit**: formato `type(scope): descripción` (ej. `feat(league-matches): ...`, `fix(auth): ...`).
- **Sin secretos en el repositorio**: credenciales, claves o hashes no deben aparecer en el código fuente versionado.
- **Regla de validación dual**: toda validación crítica de negocio implementada en el frontend debe estar replicada en el backend (excepción documentada: gap G4 del sprint 3, pendiente de resolución).

### 5.3 Métricas de calidad

Las siguientes métricas se medirán y reportarán al cierre de cada sprint:

| Métrica | Fórmula / Método de medición | Meta |
|---|---|---|
| **Densidad de defectos** | Defectos encontrados / KLOC (miles de líneas de código) | < 5 defectos / KLOC |
| **Tasa de defectos críticos** | Defectos críticos o altos / total de defectos | < 10 % |
| **Cobertura de HUs probadas** | HUs con al menos un caso de prueba ejecutado / total de HUs | 100 % |
| **Tasa de defectos resueltos** | Defectos cerrados / defectos abiertos al inicio del sprint | ≥ 80 % |
| **Tiempo medio de resolución** | Suma de (fecha cierre − fecha apertura) / nº defectos cerrados | < 3 días |
| **Pull requests con revisión** | PRs revisados y aprobados / total de PRs mergeados | 100 % |
| **Adherencia a convenciones de commit** | Commits con formato correcto / total de commits | ≥ 90 % |

---

## 6. Revisiones y auditorías

### 6.1 Revisión de requisitos (Requirement Review)

**Objetivo**: verificar que las HUs son completas, no ambiguas y probables antes de la implementación.

**Criterios de entrada**:
- HUs escritas con narrativa, criterios de aceptación (Gherkin) y notas de implementación.
- Gaps y TODOs identificados y documentados.

**Criterios de salida**:
- Todos los escenarios tienen happy path y al menos un camino alternativo o de error.
- Mensajes de UI citados verificados contra el código o marcados como `[TODO]`.
- Gaps aceptados formalmente o convertidos en HUs de deuda técnica.

**Participantes**: líder de QA, al menos un desarrollador.

### 6.2 Revisión de código (Code Review / Pull Request Review)

**Objetivo**: detectar defectos, verificar adherencia a estándares y validar que la implementación satisface la HU correspondiente.

**Checklist obligatorio para el revisor**:

- [ ] El código no introduce consultas SQL por interpolación de strings.
- [ ] Las rutas de API nuevas validan los campos requeridos y retornan el código HTTP correcto.
- [ ] No se almacenan contraseñas u otros secretos en texto plano.
- [ ] Los errores son capturados y comunicados al usuario (no `catch` vacíos en flujos visibles).
- [ ] El tipado TypeScript es correcto; no hay `any` no justificados.
- [ ] Los componentes nuevos tienen los campos obligatorios marcados visualmente (requisito de sprint 3).
- [ ] El código no introduce regresiones en funcionalidades existentes.
- [ ] Los mensajes de UI coinciden exactamente con los definidos en las HUs.
- [ ] Las conexiones a la base de datos son cerradas en todos los caminos de ejecución.

**Criterio de aprobación**: todos los ítems del checklist satisfechos; el revisor aprueba el PR.

### 6.3 Revisión de seguridad (Security Review)

**Objetivo**: identificar vulnerabilidades antes de cada entrega de sprint.

**Áreas a revisar en cada sprint**:

| Área | Verificación |
|---|---|
| Inyección SQL | Confirmar uso de parámetros `?` en todas las consultas SQLite |
| Autenticación | Verificar que las rutas del dashboard están protegidas con guard de sesión |
| Endpoints desprotegidos | Auditar que no existan rutas de escritura (POST/PUT/DELETE) accesibles sin autenticación (gap G3 — pendiente de resolución) |
| XSS | Verificar que no se use `dangerouslySetInnerHTML` sin sanitización |
| Exposición de datos sensibles | Confirmar que el backend no retorna el hash de contraseña en respuestas JSON |
| Secretos en repo | Ejecutar búsqueda de patrones de contraseñas o claves en el historial de commits |

### 6.4 Auditoría de proceso (Process Audit)

Al final de cada sprint se verifica:

- Las métricas definidas en la sección 5.3 están calculadas y documentadas.
- Todos los defectos del registro están en estado "Cerrado" o tienen justificación para posponerse.
- Las actividades de revisión planificadas se ejecutaron y sus resultados están registrados.
- Los gaps y TODOs de las HUs tienen decisión de producto documentada.

---

## 7. Pruebas

### 7.1 Estrategia general de pruebas

El proyecto sigue una estrategia de pruebas en capas:

```
┌────────────────────────────────────────────────┐
│         Pruebas de Aceptación (E2E)            │  ← HUs con escenarios Gherkin
├────────────────────────────────────────────────┤
│         Pruebas Funcionales (API)              │  ← Endpoints REST
├────────────────────────────────────────────────┤
│         Pruebas de Lógica de Negocio           │  ← services.py
├────────────────────────────────────────────────┤
│         Revisión estática / Lint               │  ← ESLint, mypy/flake8
└────────────────────────────────────────────────┘
```

### 7.2 Casos de prueba por módulo

#### 7.2.1 Módulo de autenticación (HU-11)

| ID | Escenario | Entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| T-AUTH-01 | Login exitoso | Email y contraseña válidos | HTTP 200; `sessionStorage["userSession"]` guardado; redirección a `/dashboard` | Alta |
| T-AUTH-02 | Credenciales incorrectas | Contraseña errónea | HTTP 401; mensaje `"Usuario o contraseña incorrectos"`; sin sesión guardada | Alta |
| T-AUTH-03 | Servidor no disponible | Servidor Flask detenido | Error `"Unable to reach the server…"` mostrado en UI | Media |
| T-AUTH-04 | Campos vacíos | Formulario enviado sin completar | Validación HTML5 nativa; sin petición al servidor | Media |
| T-AUTH-05 | Acceso directo a `/dashboard` sin sesión | `sessionStorage` vacío | Redirección automática a `/login` | Alta |
| T-AUTH-06 | Inyección en campo email | `' OR '1'='1` como email | HTTP 401 o 400; sin acceso al dashboard | Alta |

#### 7.2.2 Módulo de equipos (Teams)

| ID | Escenario | Entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| T-TEAM-01 | Crear equipo válido | Nombre, país, ciudad, abreviación + ≥11 jugadores | HTTP 201; equipo en DB | Alta |
| T-TEAM-02 | Crear equipo con < 11 jugadores | 10 jugadores asignados | HTTP 400; error descriptivo | Alta |
| T-TEAM-03 | Jugador duplicado en solicitud | Mismo `player_id` dos veces | HTTP 400; `"Duplicate players in request"` | Media |
| T-TEAM-04 | Jugador ya asignado a otro equipo | `player_id` con equipo previo | HTTP 400; `"Player X is already assigned to another team"` | Alta |
| T-TEAM-05 | Nombre de equipo duplicado | Nombre existente en DB | HTTP 409 | Media |
| T-TEAM-06 | Eliminar equipo con partidos | Equipo con matches activos | Equipo eliminado; matches eliminados en cascada | Media |
| T-TEAM-07 | Importación masiva sin jugadores | Bulk import CSV | Equipo creado sin validación de mínimo de jugadores | Media |

#### 7.2.3 Módulo de ligas (Leagues)

| ID | Escenario | Entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| T-LG-01 | Crear liga con ≥2 equipos válidos | Nombre + lista de team_ids | HTTP 201; horario round-robin generado | Alta |
| T-LG-02 | Crear liga con < 2 equipos | 1 equipo | HTTP 400; `"At least 2 teams required"` | Alta |
| T-LG-03 | Equipo con < 11 jugadores al crear liga | Equipo con 10 jugadores | HTTP 400; mensaje con nombre del equipo | Alta |
| T-LG-04 | Generación de horario round-robin par | 4 equipos | 3 rondas, 2 partidos por ronda (6 partidos totales) | Alta |
| T-LG-05 | Generación de horario round-robin impar | 3 equipos | 3 rondas, 1 partido por ronda (3 partidos + 1 bye por ronda) | Media |
| T-LG-06 | Avance de ronda con partidos pendientes | 1 partido sin jugar | HTTP 400; error con conteo de partidos pendientes | Alta |
| T-LG-07 | Finalizar liga en última ronda | Todos los partidos de la última ronda jugados | Liga marcada como `completed` | Alta |
| T-LG-08 | Nombre de liga duplicado | Nombre existente | HTTP 409 | Media |

#### 7.2.4 Módulo de partidos (Matches)

| ID | Escenario | Entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| T-MATCH-01 | Registrar resultado válido | Marcador final 2–1 | HTTP 200; `played=1`; `winner_id` correcto | Alta |
| T-MATCH-02 | Marcador de primer tiempo mayor al final | HT 2–0, FT 1–0 | HTTP 400; `"Halftime scores cannot exceed final scores"` | Alta |
| T-MATCH-03 | Marcador negativo | `score_team1 = -1` | HTTP 400; `"Scores must be non-negative"` | Alta |
| T-MATCH-04 | Empate (draw) | Marcador 1–1 | `winner_id = null`; ambos equipos +1 punto en standings | Alta |
| T-MATCH-05 | Editar partido ya jugado vía PATCH | Solicitud PATCH a match con `played=1` | HTTP 400; `"Match already played"` | Media |
| T-MATCH-06 | Equipos iguales en el mismo partido | `team1_id == team2_id` | HTTP 400; `"Teams must be different"` | Media |
| T-MATCH-07 | Clasificación tras múltiples resultados | 3 equipos, 2 rondas jugadas | Standings ordenados por puntos → diferencia de goles → goles a favor → H2H | Alta |

#### 7.2.5 Módulo de importación masiva (HU-06 a HU-10)

| ID | Escenario | Entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| T-IMPORT-01 | CSV de jugadores válido | Columnas name, age, position, number | Vista previa con badges "Valid"; botón habilitado | Alta |
| T-IMPORT-02 | CSV de equipos válido | Columnas name, country, city, abbreviation | Vista previa válida | Alta |
| T-IMPORT-03 | Formato no soportado | Archivo .pdf | Error `"Unsupported format…"` | Media |
| T-IMPORT-04 | Archivo vacío | CSV sin filas de datos | Error `"The file appears to be empty…"` | Media |
| T-IMPORT-05 | Edad fuera de rango | `age = 10` | Fila marcada "Invalid"; error `"Age must be a number between 15 and 50"` | Media |
| T-IMPORT-06 | Cambio de tipo con vista previa activa | Cambiar de Players a Teams | Vista previa anterior descartada; área de carga limpia | Media |
| T-IMPORT-07 | Importación parcialmente exitosa | 5 filas válidas, 2 fallan en API | 5 badges "Imported", 2 badges "Failed"; resumen correcto | Alta |
| T-IMPORT-08 | Descarga de plantilla de jugadores | Clic en "Download template" (tipo Players) | Archivo `players_template.csv` con columnas correctas | Baja |

#### 7.2.6 Módulo de gestión de partidos de liga (HU-01 a HU-05)

| ID | Escenario | Entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| T-LM-01 | Cargar liga existente | Selección en dropdown | Rondas visibles; solo ronda `current_round` expandida | Alta |
| T-LM-02 | Liga sin rondas | Liga sin matches generados | Mensaje `"No rounds generated for this league yet."` | Media |
| T-LM-03 | Expandir ronda futura | Clic en encabezado de ronda futura | Aviso de ronda no activa visible; campos de marcador deshabilitados | Alta |
| T-LM-04 | Auto-guardado de logística | Edición de Venue/Referee/fecha con espera ≥1.2 s | Indicador "Saving…" → "Saved"; datos persistidos | Media |
| T-LM-05 | Botón avance deshabilitado | Partidos pendientes en ronda actual | Botón deshabilitado; mensaje `"Complete N remaining match(es) to advance"` | Alta |

### 7.3 Criterios de entrada y salida de pruebas

**Criterios de entrada** (para comenzar la ejecución de pruebas):
- El backend Flask está ejecutándose en `http://127.0.0.1:5000`.
- La base de datos está inicializada con el esquema completo.
- El frontend Next.js está ejecutándose en modo desarrollo o producción.
- Todos los defectos críticos y altos del sprint anterior están resueltos.

**Criterios de salida** (para declarar el sprint como aprobado en QA):
- El 100 % de los casos de prueba de prioridad Alta han sido ejecutados.
- 0 defectos de severidad Crítica abiertos.
- ≤ 2 defectos de severidad Alta abiertos (con justificación documentada).
- Las métricas de la sección 5.3 han sido calculadas y están dentro de los umbrales.

### 7.4 Clasificación de defectos

| Severidad | Criterio |
|---|---|
| **Crítica** | El sistema no funciona en absoluto o compromete datos/seguridad (ej. bypass de autenticación, pérdida de datos, SQL injection explotable) |
| **Alta** | Una funcionalidad principal está rota; no existe workaround | 
| **Media** | Una funcionalidad secundaria falla o el comportamiento difiere del especificado en las HUs |
| **Baja** | Problema cosmético, de usabilidad menor o inconsistencia de texto sin impacto en funcionalidad |

---

## 8. Reporte de problemas y acciones correctivas

### 8.1 Proceso de reporte

1. **Detección**: cualquier miembro del equipo puede reportar un defecto.
2. **Registro**: el defecto se registra con los siguientes campos:

| Campo | Descripción |
|---|---|
| ID | Identificador único secuencial (ej. `DEF-001`) |
| Fecha de detección | Fecha en que se encontró el defecto |
| Detectado por | Nombre del reportante |
| HU relacionada | ID de la historia de usuario afectada |
| Módulo | Componente o endpoint afectado |
| Descripción | Descripción clara del comportamiento observado |
| Pasos para reproducir | Secuencia detallada para reproducir el defecto |
| Resultado esperado | Comportamiento correcto según las HUs |
| Resultado obtenido | Comportamiento actual del sistema |
| Severidad | Crítica / Alta / Media / Baja |
| Estado | Abierto / En progreso / Resuelto / Cerrado / Postpuesto |
| Asignado a | Desarrollador responsable de la corrección |
| Fecha de resolución | Fecha en que se resolvió (si aplica) |
| Referencia al commit/PR | Hash de commit o número de PR que corrige el defecto |

3. **Priorización**: el Líder de QA asigna severidad y responsable dentro de las 24 horas de apertura.
4. **Corrección**: el desarrollador asignado implementa la corrección en una rama específica y abre un PR.
5. **Verificación**: el tester funcional verifica que el defecto está resuelto y no introduce regresiones.
6. **Cierre**: el Líder de QA cierra el defecto una vez verificada la corrección.

### 8.2 Gaps de producto documentados (Sprint 3)

Los siguientes gaps identificados en las HUs no son defectos sino decisiones de producto pendientes. Cada uno debe tener una decisión explícita antes del cierre del proyecto:

| ID Gap | Descripción | Severidad sugerida | Decisión requerida |
|---|---|---|---|
| G1 | No existe funcionalidad de logout | Alta | Implementar o aceptar formalmente |
| G2 | No existe "forgot password" | Baja | Aceptar para MVP |
| G3 | Endpoints de gestión sin autenticación en backend | Crítica | Implementar middleware de auth o aceptar con riesgo documentado |
| G4 | Validaciones de edad (15–50) y número (1–99) solo en frontend | Alta | Replicar en backend o documentar como gap aceptado |
| G5 | Mensajes de error del backend en español, UI en inglés | Baja | Unificar idioma |
| G6 | Estado `completed` de liga no reversible desde UI | Media | Implementar botón de reabrir o aceptar |
| G7 | Auto-guardado de logística falla silenciosamente | Media | Mostrar indicador de error o documentar decisión |
| G8 | `/login` no redirige a usuarios ya autenticados | Baja | Agregar guard o aceptar |

---

## 9. Herramientas, técnicas y metodologías

### 9.1 Herramientas de desarrollo y calidad

| Categoría | Herramienta | Propósito |
|---|---|---|
| Control de versiones | Git + GitHub | Versionamiento de código y revisiones de PR |
| Gestión de ramas | GitHub Flow (feature branches + PRs) | Flujo de integración controlada |
| Linting Frontend | ESLint (configuración Next.js) | Verificación estática de TypeScript/React |
| Build / Type-check | TypeScript Compiler (`tsc`) | Verificación de tipos en tiempo de compilación |
| Linting Backend | flake8 / pylint (recomendado) | Verificación de estilo PEP 8 y errores Python |
| Framework Frontend | Next.js 16, React 19 | Aplicación web SSR/CSR |
| Framework Backend | Flask 3.x, Flask-CORS | API REST |
| Base de datos | SQLite 3 | Persistencia de datos |
| Librería de UI | Radix UI + shadcn/ui + Tailwind CSS 4 | Componentes accesibles y estilizados |
| Validación de formularios | React Hook Form + Zod | Validación en capa de presentación |
| Hashing | bcrypt | Almacenamiento seguro de contraseñas |
| Parseo de archivos | PapaParse (CSV), xlsx (Excel) | Importación masiva |
| Notificaciones UI | Sonner | Toasts de feedback al usuario |
| Gráficas | Recharts | Visualización de datos |

### 9.2 Técnicas de prueba aplicadas

| Técnica | Aplicación en el proyecto |
|---|---|
| **Caja negra** | Pruebas funcionales de endpoints REST y flujos de UI según las HUs |
| **Partición de equivalencia** | Validación de rangos (edad, número de jugadores, marcadores) |
| **Análisis de valores límite** | Edad mínima 15 / máxima 50; jugadores mínimos 11 por equipo |
| **Prueba de escenarios (BDD)** | Escenarios Gherkin de las HUs como base de los casos de prueba |
| **Prueba de regresión** | Ejecución de casos previos tras cada corrección de defecto |
| **Revisión estática** | Revisión de código en PRs usando el checklist de la sección 6.2 |
| **Prueba de seguridad básica** | Verificación de inyección SQL, exposición de datos, endpoints desprotegidos |

### 9.3 Metodología de desarrollo

El equipo sigue **Scrum con sprints de duración fija**. Las actividades de QA están integradas en la Definición de Terminado (DoD) de cada sprint:

**Definition of Done (DoD) — Sprint 3**:
- [ ] La funcionalidad implementa todos los escenarios happy path de las HUs asignadas.
- [ ] Los caminos de error y no-happy path están implementados y probados.
- [ ] El código superó la revisión de pull request (checklist completo).
- [ ] No hay defectos de severidad Crítica o Alta abiertos relacionados con la funcionalidad.
- [ ] Los mensajes de UI coinciden con los definidos en las HUs refinadas.
- [ ] Las métricas del sprint están calculadas y documentadas.

---

## 10. Control de código

### 10.1 Estructura de ramas

```
main                  ← Rama de producción / entrega estable
  └─ Juanes           ← Rama de desarrollo activa (sprint 3)
       └─ feature/*   ← Ramas de funcionalidades (por HU)
       └─ fix/*       ← Ramas de corrección de defectos
```

### 10.2 Políticas de control

- **Protección de `main`**: no se permite push directo; solo merges mediante PR aprobado.
- **Merges**: squash merge o merge commit con historial limpio; no fast-forward sin revisión.
- **Tags**: se crea un tag semántico (`v0.1.0`, `v0.2.0`, etc.) al cierre de cada sprint.
- **Rollback**: ante un defecto crítico en `main`, se revierte mediante `git revert` (no `git reset --hard`) para preservar el historial.
- **Base de datos SQLite**: los archivos `*.db` no se deben versionar con datos de producción; solo el esquema de inicialización en `database.py` está bajo control de versiones.

### 10.3 Elementos bajo control de configuración

| Elemento | Ubicación | Control |
|---|---|---|
| Código fuente frontend | `app/`, `components/`, `lib/`, `hooks/` | Git |
| Código fuente backend | `backend/src/` | Git |
| Configuración de proyecto | `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs` | Git |
| Dependencias Python | `backend/requirements.txt` | Git |
| Este SQAP | `docs/SQAP-IEEE730.md` | Git |
| Historias de usuario | `docs/historias-usuario*.md` | Git |
| Script de semilla | `backend/seed_players.py` | Git |
| Base de datos | `backend/championship.db`, `backend/usuarios.db` | **Excluir de commits con datos de producción** |

---

## 11. Control de medios

### 11.1 Repositorio y respaldo

- El repositorio principal está alojado en **GitHub** bajo el usuario `juanes4`, rama `Juanes`.
- Cada desarrollador mantiene una copia local (clon) que sirve como respaldo distribuido inherente a Git.
- Se recomienda hacer un `git push` al finalizar cada sesión de trabajo para no perder progreso.

### 11.2 Archivos de base de datos

- Los archivos `championship.db` y `usuarios.db` contienen datos de prueba/desarrollo y **no deben contener datos personales reales de producción**.
- Los archivos `.db` están actualmente versionados (visible en `git status`). Se recomienda añadirlos a `.gitignore` y reemplazarlos por el script de inicialización + seed, o incluirlos solo con datos de prueba genéricos.

### 11.3 Artefactos de build

- Los artefactos generados por `next build` (carpeta `.next/`) y `node_modules/` están en `.gitignore` y no se versionan.
- Los archivos `__pycache__/` del backend tampoco se versionan.

---

## 12. Control de proveedores

### 12.1 Dependencias de terceros

El proyecto depende de librerías de código abierto. Las políticas para su gestión son:

| Política | Detalle |
|---|---|
| **Versiones fijadas** | Las versiones en `package.json` deben estar explícitamente fijadas (no usar `*` o `latest`) |
| **Revisión antes de actualización** | Antes de actualizar una dependencia, revisar el CHANGELOG en busca de breaking changes |
| **Vulnerabilidades conocidas** | Ejecutar `npm audit` antes del cierre de cada sprint; resolver vulnerabilidades de severidad High o Critical |
| **Licencias** | Verificar que las licencias de nuevas dependencias sean compatibles (MIT, Apache 2.0, BSD preferidas) |
| **Backend** | Fijar versiones en `requirements.txt` con el formato `flask>=3.0.0,<4.0.0` |

### 12.2 Librerías críticas identificadas

| Librería | Propósito | Riesgo a monitorear |
|---|---|---|
| `bcrypt ^6.0.0` | Hashing de contraseñas | Vulnerabilidades en algoritmo de hashing |
| `next 16.2.0` | Framework web | Parches de seguridad frecuentes |
| `zod ^3.24.1` | Validación de esquemas | Cambios en API de validación |
| `flask>=3.0.0` | API REST | Vulnerabilidades de seguridad web |
| `flask-cors>=4.0.0` | CORS | Configuración incorrecta puede exponer la API |

---

## 13. Recolección, mantenimiento y retención de registros

### 13.1 Registros a mantener

| Registro | Formato | Ubicación | Retención |
|---|---|---|---|
| Este SQAP | Markdown | `docs/SQAP-IEEE730.md` en Git | Duración del proyecto + 1 semestre |
| Historias de usuario | Markdown | `docs/` en Git | Duración del proyecto |
| Registro de defectos | Tabla Markdown o issue de GitHub | `docs/defect-log.md` o Issues del repo | Duración del proyecto |
| Resultados de ejecución de pruebas | Markdown | `docs/test-results-sprintN.md` | Por sprint |
| Informe de métricas | Markdown | `docs/metrics-sprintN.md` | Por sprint |
| Historial de revisiones de código | GitHub Pull Requests | GitHub | Permanente en la plataforma |
| Auditorías de proceso | Acta breve | `docs/audit-sprintN.md` | Por sprint |

### 13.2 Identificación de versiones

Cada documento de registro debe incluir en su encabezado:
- Nombre del documento
- Versión (número incremental)
- Fecha de última modificación
- Sprint al que corresponde

---

## 14. Capacitación

### 14.1 Conocimientos requeridos del equipo

| Área | Nivel requerido |
|---|---|
| TypeScript / React / Next.js | Intermedio — capaz de desarrollar componentes y hooks |
| Python / Flask / SQLite | Básico-intermedio — capaz de crear y modificar rutas y consultas |
| Git / GitHub Flow | Básico — commits, branches, pull requests, merge |
| Principios SOLID | Básico — aplicados en refactorización del sprint 3 |
| OWASP Top 10 | Básico — prevención de inyección SQL, XSS, broken auth |
| BDD / Gherkin | Básico — lectura e interpretación de escenarios de las HUs |

### 14.2 Actividades de capacitación

- Al inicio del proyecto, el equipo revisó las HUs refinadas y los estándares de codificación aquí definidos.
- Los checklist de revisión de código (sección 6.2) sirven como guía de capacitación continua para revisores.
- Ante la incorporación de un nuevo miembro, el Líder de QA realiza una sesión de inducción sobre este SQAP.

---

## 15. Gestión de riesgos

### 15.1 Registro de riesgos de calidad

| ID | Riesgo | Probabilidad | Impacto | Nivel | Estrategia de mitigación |
|---|---|---|---|---|---|
| RQ-01 | **Endpoints REST sin autenticación (G3)**: cualquier usuario puede modificar datos de ligas/equipos/partidos sin autenticarse | Alta | Crítico | **Crítico** | Implementar middleware de autenticación en Flask que valide la sesión antes de rutas de escritura; o reducir alcance del sistema a uso local/confiable con riesgo documentado |
| RQ-02 | **Validaciones solo en frontend (G4)**: la API acepta edades < 15 o > 50 y números de camiseta fuera de rango | Alta | Alto | **Alto** | Replicar validaciones en el backend; o documentar formalmente como gap aceptado de MVP |
| RQ-03 | **Sin logout (G1)**: si el dispositivo es compartido, otro usuario puede acceder a la sesión activa | Alta | Alto | **Alto** | Implementar botón de logout que limpie `sessionStorage` |
| RQ-04 | **Auto-guardado silencioso (G7)**: datos logísticos de partidos se pierden sin notificación al usuario | Media | Medio | **Medio** | Mostrar indicador de error en el `catch` de `useAutoSave.ts`; o documentar como comportamiento aceptado |
| RQ-05 | **SQLite en producción**: limitaciones de concurrencia con múltiples usuarios simultáneos | Baja | Alto | **Medio** | Para el alcance universitario actual es aceptable; documentar como limitación para escalamiento futuro |
| RQ-06 | **Secrets en el repositorio**: contraseña de administrador hardcodeada en `routes.py` | Media | Alto | **Alto** | Mover la lógica de seeding a un script separado no versionado, o usar variables de entorno; nunca versionar contraseñas |
| RQ-07 | **Deuda técnica acumulada**: múltiples TODOs de producto sin decisión bloquean funcionalidades futuras | Media | Medio | **Medio** | Revisar y tomar decisión en cada TODOs antes del cierre de proyecto |
| RQ-08 | **Falta de pruebas automatizadas**: ausencia de suite de regresión automatizada eleva riesgo de regresiones | Alta | Medio | **Alto** | Definir al menos pruebas mínimas para los endpoints críticos con pytest; priorizar en próximo sprint |

### 15.2 Monitoreo de riesgos

- Los riesgos de nivel **Crítico** y **Alto** se revisan en cada sprint.
- El estado de cada riesgo (Activo / Mitigado / Aceptado) se actualiza en este documento.
- La aparición de nuevos riesgos durante el proyecto se agrega a esta tabla.

### 15.3 Estado actual de riesgos (Sprint 3)

| ID | Estado | Observación |
|---|---|---|
| RQ-01 | **Activo** | Gap G3 documentado en HUs; sin mitigación implementada aún |
| RQ-02 | **Activo** | Gap G4 documentado; validaciones solo en frontend |
| RQ-03 | **Activo** | Gap G1 documentado; no hay logout |
| RQ-04 | **Activo** | Gap G7 documentado; fallo silencioso por diseño actual |
| RQ-05 | **Aceptado** | Alcance universitario; no hay requisito de concurrencia |
| RQ-06 | **Mitigado** | Se eliminó la contraseña del código; los administradores se crean con `backend/create_admin.py` pasando las credenciales por argumentos. La contraseña sigue en el historial de git: debe cambiarse antes de cualquier despliegue |
| RQ-07 | **Activo** | 6 TODOs pendientes de decisión al cierre del sprint 3 |
| RQ-08 | **Activo** | No existe suite de pruebas automatizadas en el repositorio |

---

## Historial de revisiones del documento

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-05-19 | Equipo Sprint 3 | Versión inicial del SQAP |
| 1.1 | 2026-10-26 | Equipo Sprint 3 | RQ-06 pasa a Mitigado tras retirar las credenciales del código |

---

*Este documento es un artefacto vivo. Debe actualizarse al inicio de cada sprint para reflejar el estado actual del proyecto, las nuevas decisiones de producto y los cambios en la organización del equipo.*
