# Historias de Usuario Refinadas — League Match Management & Import CSV / Excel

> **Generadas el 2026-05-18** a partir del análisis `RECOMENDACIONES_HU.md` y verificación directa del código fuente.
> Las HUs originales se mantienen intactas en `docs/historias-usuario.md`.
>
> **Convenciones:**
> - Narrativa y Gherkin en español.
> - Mensajes literales de UI entre comillas en su idioma original (inglés para el dashboard, español para errores del backend de login).
> - Valores dinámicos indicados con `[N]`, `[texto]`, etc.
> - `[TODO]` marca decisiones pendientes de producto.
> - Mensajes literales verificados contra el código salvo que se indique lo contrario.

---

## HU-01 — Seleccionar una liga para gestionar sus partidos

Como administrador del sistema,
 quiero seleccionar una liga desde un menú desplegable,
 para ver y gestionar las rondas y partidos de esa liga.

### Escenario 1 — Estado inicial: sin liga seleccionada
Given el administrador accede a la vista "League Match Management"
 When la pantalla termina de cargar
 Then el selector muestra el placeholder "Choose a league…"
 And no se muestran rondas ni tabla de clasificación

### Escenario 2 — Happy Path: liga con rondas disponibles
Given que existen ligas registradas en el sistema
 When el administrador selecciona una liga del selector
 Then el sistema muestra el indicador "Loading league data…" mientras carga
 And al completarse, se presentan las rondas y partidos de esa liga
 And únicamente la ronda actual (campo `current_round` de la liga) aparece expandida por defecto
 And las demás rondas (pasadas y futuras) aparecen contraídas
 And se muestra la tabla de clasificación actualizada en el panel lateral

### Escenario 3 — Happy Path: cambio de liga seleccionada
Given el administrador tiene una liga ya cargada en pantalla
 When selecciona una liga diferente del selector
 Then las rondas y la clasificación se reemplazan con los datos de la nueva liga
 And únicamente la ronda actual de la nueva liga aparece expandida

### Escenario 4 — No Happy Path: error al cargar la liga
Given que el administrador selecciona una liga
 When la petición al servidor falla
 Then el sistema muestra el mensaje "Could not load the league data. Please try again."
 And no se muestran rondas ni clasificación

### Escenario 5 — No Happy Path: no hay ligas registradas
Given que no existen ligas registradas en el sistema
 When el administrador abre el selector de liga
 Then dentro del selector se muestra el mensaje "No leagues found"
 And no hay opciones seleccionables

---

## HU-02 — Expandir y contraer rondas del torneo

Como administrador,
 quiero expandir o contraer cada ronda individualmente,
 para revisar solo la información que me interesa sin saturar la vista.

> **Nota de implementación:** El componente permite tener múltiples rondas expandidas simultáneamente; no es un acordeón de apertura exclusiva.

### Escenario 1 — Happy Path: expandir ronda futura
Given que una liga está seleccionada y tiene rondas futuras
 When el administrador hace clic en el encabezado de una ronda futura
 Then la ronda se expande mostrando sus partidos
 And se muestra el aviso: "This round is not yet active. You can schedule matches now — venue, referee, and date will be saved. Score entry opens when the round starts."

### Escenario 2 — Happy Path: expandir ronda pasada (completada)
Given que una liga seleccionada tiene rondas anteriores completadas
 When el administrador hace clic en el encabezado de una ronda pasada
 Then la ronda se expande mostrando sus partidos con los resultados registrados
 And los campos de marcador están deshabilitados (solo lectura)

### Escenario 3 — Happy Path: contraer ronda activa
Given que la ronda actual está expandida
 When el administrador hace clic en su encabezado
 Then la ronda se contrae ocultando sus partidos

### Escenario 4 — Happy Path: múltiples rondas expandidas
Given que una ronda está expandida
 When el administrador hace clic en el encabezado de otra ronda diferente
 Then ambas rondas quedan expandidas simultáneamente

### Escenario 5 — No Happy Path: liga sin rondas generadas
Given que el administrador selecciona una liga que no tiene rondas
 When el sistema termina de cargar los datos
 Then se muestra el mensaje "No rounds generated for this league yet."

---

## HU-03 — Registrar el resultado de un partido

Como administrador,
 quiero ingresar el marcador final y el marcador de primer tiempo de un partido,
 para actualizar los resultados y que la clasificación se recalcule automáticamente.

### Escenario 1 — Happy Path: resultado guardado correctamente
Given que la ronda actual está expandida y hay partidos sin jugar
 And el administrador ingresa un marcador final válido (ej. 2 – 1)
 When hace clic en "Save Result"
 Then el sistema guarda el resultado
 And aparece el mensaje "Result saved!" por aproximadamente 3 segundos
 And el partido cambia su estado visual a "Played" (indicador verde)
 And la clasificación del panel lateral se actualiza

### Escenario 2 — No Happy Path: marcador de primer tiempo mayor al final
Given que el administrador ingresa el marcador final 1 – 0
 And ingresa el marcador de primer tiempo 2 – 0
 When hace clic en "Save Result"
 Then el sistema muestra el error "HT (2–0) cannot exceed final score (1–0)"
 And el resultado no se guarda

### Escenario 3 — No Happy Path: marcadores incompletos
Given que el administrador deja uno de los dos campos de marcador final vacío
 When observa el área del partido
 Then el botón "Save Result" permanece deshabilitado
 And se muestra el texto "Enter both scores to save"

### Escenario 4 — No Happy Path: error del servidor al guardar
Given que el administrador ha ingresado un marcador final válido
 When hace clic en "Save Result"
 And la petición al servidor falla
 Then el sistema muestra el mensaje de error bajo la tarjeta del partido
 And el partido conserva su estado anterior (no jugado)

> **Nota:** El frontend previene el ingreso de valores negativos en los campos de marcador. El error de marcadores negativos no es alcanzable desde la UI.

---

## HU-04 — Programar detalles logísticos de un partido futuro

Como administrador,
 quiero registrar el estadio, el árbitro y la fecha/hora de partidos de rondas futuras,
 para tener la información logística disponible antes de que la ronda esté activa.

### Escenario 1 — Happy Path: datos guardados automáticamente
Given que el administrador expande una ronda futura
 And modifica el campo "Venue", "Referee" o la fecha/hora de un partido
 When deja de escribir por más de 1.2 segundos
 Then se muestra el indicador "Saving…" mientras la operación está en curso
 And al completarse aparece brevemente el indicador "Saved"
 And los datos quedan persistidos sin requerir acción manual del usuario

### Escenario 2 — No Happy Path: intento de ingresar marcador en ronda futura
Given que el administrador expande una ronda futura
 When observa las tarjetas de partido
 Then los campos de marcador están deshabilitados
 And se muestra el texto "Score entry opens when this round becomes active"

> **Nota de implementación:** El auto-guardado ignora los errores de red silenciosamente (by design); el usuario no ve ningún mensaje de fallo y puede reintentar al editar el campo nuevamente.
> [TODO — Producto] Evaluar si el fallo silencioso del auto-guardado es aceptable o si se debe mostrar un indicador de error.

---

## HU-05 — Avanzar a la siguiente ronda

Como administrador,
 quiero avanzar el torneo a la siguiente ronda cuando todos los partidos de la ronda actual estén jugados,
 para habilitar la edición de resultados de los próximos partidos.

### Escenario 1 — Happy Path: avance exitoso
Given que todos los partidos de la ronda actual están marcados como "Played"
 And la liga no está en su última ronda
 When el administrador hace clic en "Advance to Round [N+1]"
 Then el sistema avanza la liga a la siguiente ronda
 And la nueva ronda aparece como la ronda activa y expandida por defecto

### Escenario 2 — Happy Path: finalizar liga en la última ronda
Given que todos los partidos de la última ronda están jugados
 When el administrador hace clic en "Finish League"
 Then el sistema marca la liga como completada
 And el badge de estado cambia a "Completed"

> **Nota:** "Advance to Round [N+1]" y "Finish League" son el mismo botón; el texto cambia según si la ronda actual es la última o no.

### Escenario 3 — No Happy Path: partidos pendientes en la ronda actual
Given que quedan partidos sin jugar en la ronda actual
 When el administrador observa el área de control de la ronda
 Then el botón de avance está deshabilitado
 And si quedan 2 partidos se muestra: "Complete 2 remaining matches to advance"
 And si queda 1 partido se muestra: "Complete 1 remaining match to advance"

### Escenario 4 — No Happy Path: todos los partidos jugados (listo para avanzar)
Given que todos los partidos de la ronda actual están jugados
 When el administrador observa el área de control de la ronda
 Then se muestra el mensaje "All matches completed — ready to advance!"
 And el botón de avance está habilitado

### Escenario 5 — No Happy Path: error al avanzar de ronda
Given que todos los partidos de la ronda actual están jugados
 When el administrador hace clic en el botón de avance
 And la petición al servidor falla
 Then el sistema muestra el mensaje de error debajo del botón
 And la ronda actual no cambia

---

## HU-06 — Seleccionar el tipo de datos a importar

Como administrador,
 quiero elegir si importaré jugadores o equipos antes de subir el archivo,
 para que el sistema valide las columnas correctas según el tipo seleccionado.

### Escenario 1 — Estado inicial al entrar a Bulk Import
Given el administrador accede a la vista "Bulk Import"
 When la pantalla termina de cargar
 Then el tipo "Players" está seleccionado por defecto
 And el área de carga está vacía y lista para recibir un archivo

### Escenario 2 — Happy Path: cambio de tipo limpia el estado anterior
Given que el administrador ha cargado un archivo de jugadores con vista previa activa
 When cambia el tipo a "Teams"
 Then se elimina la vista previa anterior sin mostrar diálogo de confirmación
 And se muestran las columnas requeridas para equipos
 And el área de carga queda lista para un nuevo archivo

> **Nota:** El cambio de tipo con vista previa activa descarta los datos silenciosamente (sin diálogo de confirmación). [TODO — Producto] Evaluar si agregar confirmación para evitar pérdida accidental de datos.

### Escenario 3 — No Happy Path: cambio de tipo durante importación activa
Given que el administrador ha iniciado una importación
 When observa los botones de selección de tipo
 Then los botones de selección de tipo están deshabilitados
 And la importación continúa sin interrupciones

---

## HU-07 — Cargar un archivo CSV o Excel

Como administrador,
 quiero subir un archivo arrastrándolo o buscándolo en mi equipo,
 para importar datos de jugadores o equipos de forma masiva.

### Escenario 1 — Happy Path: archivo CSV válido cargado por drag & drop
Given que el administrador tiene un archivo .csv con el formato correcto
 When lo arrastra sobre la zona de carga (antes de soltar)
 Then la zona de carga se resalta visualmente para indicar que acepta el archivo
 And al soltar el archivo, el sistema lo procesa
 And muestra una tabla de vista previa con las filas detectadas
 And cada fila muestra el badge "Valid" o "Invalid" según su contenido

### Escenario 2 — Happy Path: archivo Excel cargado con clic
Given que el administrador hace clic en la zona de carga
 And selecciona un archivo .xlsx o .xls desde su explorador
 When el archivo se procesa
 Then se muestra la tabla de vista previa con los datos de la primera hoja del libro

> **Nota:** Si el archivo Excel tiene más de una hoja, solo se procesa la primera; no se muestra advertencia por las hojas adicionales.

### Escenario 3 — No Happy Path: formato de archivo no soportado
Given que el administrador intenta subir un archivo con extensión .pdf, .txt u otro no soportado
 When el archivo se evalúa
 Then el sistema muestra el error "Unsupported format. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file."
 And no se genera ninguna vista previa

### Escenario 4 — No Happy Path: archivo vacío
Given que el administrador sube un archivo CSV sin filas de datos (solo encabezados o completamente vacío)
 When el sistema lo procesa
 Then se muestra el mensaje "The file appears to be empty or has no data rows."

### Escenario 5 — No Happy Path: archivo con encabezados no reconocidos
Given que el administrador sube un archivo CSV con columnas que no coinciden con la plantilla esperada
 When el sistema procesa el archivo
 Then las filas se muestran con badge "Invalid" y los errores de campos faltantes o no reconocidos
 And el botón de importación está deshabilitado si no hay filas "Valid"

---

## HU-08 — Descargar la plantilla CSV de ejemplo

Como administrador,
 quiero descargar una plantilla CSV con las columnas requeridas,
 para preparar mi archivo en el formato correcto antes de importar.

### Escenario 1 — Happy Path: descarga de plantilla de jugadores
Given que el tipo de importación seleccionado es "Players"
 When el administrador hace clic en "Download template"
 Then el sistema descarga el archivo `players_template.csv`
 And el archivo contiene las columnas obligatorias: `name`, `age`, `position`, `number`
 And el archivo incluye filas de ejemplo con datos de muestra

### Escenario 2 — Happy Path: descarga de plantilla de equipos
Given que el tipo de importación seleccionado es "Teams"
 When el administrador hace clic en "Download template"
 Then el sistema descarga el archivo `teams_template.csv`
 And el archivo contiene las columnas: `name`, `country`, `city`, `abbreviation` (obligatorias) y `state` (opcional)
 And el archivo incluye filas de ejemplo con datos de muestra

> **Nota:** Las columnas `photo` (jugadores) y `logo` (equipos) están excluidas de las plantillas de forma intencional; no son soportadas por la importación masiva. La columna `state` en equipos es opcional; si se omite, el backend asigna un valor por defecto.

---

## HU-09 — Previsualizar y validar filas antes de importar

Como administrador,
 quiero ver qué filas son válidas o inválidas antes de confirmar la importación,
 para corregir el archivo fuente si hay errores y evitar datos inconsistentes.

### Escenario 1 — Happy Path: todas las filas válidas
Given que el administrador carga un archivo con todas las columnas correctas y valores válidos
 When el sistema analiza el archivo
 Then todas las filas muestran el badge "Valid"
 And el botón "Import [N] records" está habilitado

### Escenario 2 — Happy Path: mezcla de filas válidas e inválidas
Given que el archivo contiene algunas filas válidas y otras con errores
 When el sistema valida el archivo
 Then las filas válidas muestran el badge "Valid"
 And las filas inválidas muestran el badge "Invalid" con sus errores específicos
 And el botón de importación muestra solo el conteo de filas válidas (ej. "Import 7 records")

### Escenario 3 — No Happy Path: fila de jugador con datos inválidos
Given que el archivo contiene un jugador con edad fuera del rango permitido (ej. 10 años) o posición desconocida
 When el sistema valida esa fila
 Then la fila muestra el badge "Invalid"
 And se listan los errores específicos (ej. "Age must be a number between 15 and 50")
 And esa fila es excluida del conteo de importación

### Escenario 4 — No Happy Path: fila de equipo con datos inválidos
Given que el archivo es de tipo "Teams" y contiene una fila con abreviación de más de 5 caracteres
 When el sistema valida esa fila
 Then la fila muestra el badge "Invalid" con el error de validación correspondiente

> **Nota:** Las validaciones de jugadores (edad 15–50, posición válida, número 1–99) se ejecutan en el frontend. El backend no replica todas estas reglas, por lo que deben considerarse como validaciones de capa de presentación.
> [TODO — Producto] Documentar formalmente como gap conocido: las validaciones de rango de edad y número de camiseta existen solo en el frontend.

---

## HU-10 — Importar registros válidos al sistema

Como administrador,
 quiero importar solo las filas válidas con un clic,
 para agregar múltiples jugadores o equipos sin crearlos uno a uno.

### Escenario 1 — Happy Path: importación en progreso
Given que la vista previa muestra al menos una fila con estado "Valid"
 When el administrador hace clic en "Import [N] records"
 Then el botón de importación se deshabilita
 And se muestra el progreso con el formato "Importing [X] of [N]…" conforme avanzan las peticiones

### Escenario 2 — Happy Path: importación completada sin errores
Given que el sistema completa todas las peticiones de importación exitosamente
 Then cada fila cambia su badge a "Imported"
 And se muestra el resumen "All [N] records imported successfully!"

### Escenario 3 — No Happy Path: falla parcial durante la importación
Given que el sistema intenta importar varias filas válidas
 When algunas peticiones al servidor fallan
 Then las filas exitosas muestran el badge "Imported"
 And las filas fallidas muestran el badge "Failed" con el mensaje de error de la API
 And se muestra el resumen "[N] imported, [M] failed. Review the errors above for failed rows."

### Escenario 4 — No Happy Path: falla total — ningún registro importado
Given que el sistema intenta importar los registros válidos
 When todas las peticiones al servidor fallan
 Then todas las filas muestran el badge "Failed"
 And se muestra el resumen "Import failed for all [N] records. Check the errors above."

### Escenario 5 — No Happy Path: sin registros válidos para importar
Given que todas las filas de la vista previa tienen estado "Invalid"
 When el administrador observa la barra de acciones
 Then el botón "Import" no está disponible
 And no se realiza ninguna petición al servidor

---

## HU-11 — Inicio de Sesión

Como administrador del sistema de ligas,
 quiero poder iniciar sesión con mis credenciales,
 para acceder al panel de administración y gestionar ligas, equipos, jugadores y partidos.

### Escenario 1 — Happy Path: inicio de sesión exitoso
Given el administrador se encuentra en la página de inicio de sesión (`/login`)
 And el servidor de autenticación está disponible
 When el administrador ingresa un nombre de usuario y contraseña válidos
 And hace clic en el botón "Go to Dashboard"
 Then el botón muestra "Verifying..." mientras se procesa la petición
 And el sistema almacena la sesión en `sessionStorage` bajo la clave `"userSession"`
 And redirige al administrador al panel de administración (`/dashboard`)

### Escenario 2 — No Happy Path: credenciales incorrectas
Given el administrador se encuentra en la página de inicio de sesión
 And el servidor de autenticación está disponible
 When el administrador ingresa un nombre de usuario o contraseña incorrectos
 And hace clic en el botón "Go to Dashboard"
 Then el sistema muestra el mensaje "Usuario o contraseña incorrectos"
 And el administrador permanece en la página de inicio de sesión
 And los campos de usuario y contraseña siguen disponibles para un nuevo intento

> **Nota:** El mensaje de error proviene directamente del backend y está en español; el resto de la UI de login está en inglés. [TODO — Producto] Decidir si unificar el idioma del mensaje de error (requiere cambio en el backend).

### Escenario 3 — No Happy Path: servidor no disponible
Given el administrador se encuentra en la página de inicio de sesión
 And el servidor no está disponible o no responde
 When el administrador ingresa sus credenciales
 And hace clic en el botón "Go to Dashboard"
 Then el sistema muestra el mensaje: "Unable to reach the server. Please check your connection or try again later."
 And el administrador permanece en la página de inicio de sesión
 And no se almacena ninguna sesión en el navegador

### Escenario 4 — No Happy Path: campos vacíos
Given el administrador se encuentra en la página de inicio de sesión
 When el administrador no ingresa el nombre de usuario o la contraseña
 And intenta hacer clic en el botón "Go to Dashboard"
 Then el navegador impide el envío del formulario mediante validación nativa HTML5 (atributo `required`)
 And señala visualmente el campo vacío como obligatorio
 And no se realiza ninguna petición al servidor

### Escenario 5 — Happy Path: navegación de regreso al inicio
Given el administrador se encuentra en la página de inicio de sesión
 When hace clic en el enlace "← Back to Home"
 Then es redirigido a la página principal (`/`)
 And no se envía ninguna petición de autenticación

> [TODO — Producto] Definir comportamiento cuando un usuario con sesión activa en `sessionStorage` navega a `/login`: actualmente se muestra el formulario de login sin redirigir automáticamente al dashboard. Evaluar si es deseable redirigir.

---

## Gaps reales del producto (no son bugs de las HUs)

Estos gaps existen en el código y deben gestionarse como HUs separadas de deuda técnica o mejora:

| # | Gap | Referencia en código |
|---|-----|----------------------|
| G1 | No existe funcionalidad de logout | `sessionStorage` se guarda pero nunca se limpia desde la UI |
| G2 | No existe "forgot password" | Solo hay login, sin recuperación de contraseña |
| G3 | Endpoints de gestión son públicos a nivel de API | El backend no valida autenticación en rutas de partidos, ligas, etc. |
| G4 | Validaciones de edad (15–50) y número (1–99) solo en frontend | El backend acepta cualquier valor numérico |
| G5 | Mensajes de error del backend en español, UI en inglés | `"Usuario o contraseña incorrectos"` vs. resto en inglés |
| G6 | Estado `completed` de liga no es reversible desde la UI | No hay botón de deshacer o reabrir liga |
| G7 | El auto-guardado de logística falla silenciosamente | `useAutoSave.ts:44` — `catch` vacío por diseño |
| G8 | `/login` no redirige a usuarios ya autenticados | Verificado en `login/page.tsx` — no hay guard de sesión |

---

## TODOs pendientes de decisión de producto

| ID | HU | Descripción |
|----|----|-------------|
| T1 | HU-04 | ¿El fallo silencioso del auto-guardado es aceptable o se debe mostrar indicador de error? |
| T2 | HU-06 | ¿Agregar diálogo de confirmación al cambiar tipo con vista previa activa? |
| T3 | HU-09 | Documentar formalmente que validaciones de rango (edad, número camiseta) son solo frontend |
| T4 | HU-11 | ¿Unificar idioma del mensaje de credenciales incorrectas (requiere cambio en backend)? |
| T5 | HU-11 | ¿Redirigir automáticamente al dashboard si el usuario ya tiene sesión activa al visitar `/login`? |
| T6 | General | ¿Levantar HUs separadas para logout, forgot password, y hardening de API? |
