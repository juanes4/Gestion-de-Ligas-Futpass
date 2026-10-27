Historias de Usuario — League Match Management & Import CSV / Excel

Sección: Manage League Matches

HU-01 — Seleccionar una liga para gestionar sus partidos
Como administrador del sistema,
 quiero seleccionar una liga desde un menú desplegable,
 para ver y gestionar las rondas y partidos de esa liga.

Escenario 1 — Happy Path: liga con rondas disponibles
Given que existen ligas registradas en el sistema
 When el administrador selecciona una liga del selector
 Then el sistema carga las rondas y partidos de esa liga
 And la ronda actual aparece expandida por defecto
 And se muestra la tabla de clasificación actualizada en el panel lateral

Escenario 2 — No Happy Path: error al cargar la liga
Given que el administrador selecciona una liga
 When la petición al servidor falla
 Then el sistema muestra el mensaje "Could not load the league data. Please try again."
 And no se muestran rondas ni clasificación

Escenario 3 — No Happy Path: no hay ligas registradas
Given que no existen ligas en el sistema
 When el administrador abre el selector de liga
 Then el sistema muestra el mensaje "No leagues found"
 And no es posible seleccionar ninguna opción

HU-02 — Expandir y contraer rondas del torneo
Como administrador,
 quiero expandir o contraer cada ronda individualmente,
 para revisar solo la información que me interesa sin saturar la vista.

Escenario 1 — Happy Path: expandir ronda futura
Given que una liga está seleccionada y tiene rondas futuras
 When el administrador hace clic en el encabezado de una ronda futura
 Then la ronda se expande mostrando sus partidos
 And se muestra un aviso indicando que el marcador no puede editarse hasta que la ronda esté activa

Escenario 2 — Happy Path: contraer ronda activa
Given que la ronda actual está expandida
 When el administrador hace clic en su encabezado
 Then la ronda se contrae ocultando sus partidos

Escenario 3 — No Happy Path: liga sin rondas generadas
Given que el administrador selecciona una liga que no tiene rondas
 When el sistema carga los datos
 Then se muestra el mensaje "No rounds generated for this league yet."

HU-03 — Registrar el resultado de un partido
Como administrador,
 quiero ingresar el marcador final y el marcador de primer tiempo de un partido,
 para actualizar los resultados y que la clasificación se recalcule automáticamente.

Escenario 1 — Happy Path: resultado guardado correctamente
Given que la ronda actual está expandida y hay partidos sin jugar
 And el administrador ingresa un marcador final válido (ej. 2 – 1)
 When hace clic en "Save Result"
 Then el sistema guarda el resultado
 And el partido cambia su estado a "Played"
 And la clasificación del panel lateral se actualiza

Escenario 2 — No Happy Path: marcador de primer tiempo mayor al final
Given que el administrador ingresa el marcador final 1 – 0
 And ingresa el marcador de primer tiempo 2 – 0
 When hace clic en "Save Result"
 Then el sistema muestra el error "HT (2–0) cannot exceed final score (1–0)"
 And el resultado no se guarda

Escenario 3 — No Happy Path: marcadores incompletos
Given que el administrador deja uno de los dos campos de marcador vacío
 When intenta guardar
 Then el botón "Save Result" permanece deshabilitado
 And se muestra el mensaje "Enter both scores to save"

HU-04 — Programar detalles logísticos de un partido futuro
Como administrador,
 quiero registrar el estadio, el árbitro y la fecha/hora de partidos de rondas futuras,
 para tener la información logística disponible antes de que la ronda esté activa.

Escenario 1 — Happy Path: datos guardados automáticamente
Given que el administrador expande una ronda futura
 And escribe el nombre de un estadio en el campo "Venue"
 When deja de escribir por más de 1.2 segundos
 Then el sistema guarda automáticamente los datos sin requerir acción manual
 And aparece brevemente el indicador "Saved"

Escenario 2 — No Happy Path: intento de ingresar marcador en ronda futura
Given que el administrador expande una ronda futura
 When observa las tarjetas de partido
 Then los campos de marcador están deshabilitados
 And se muestra el mensaje "Score entry opens when this round becomes active"

HU-05 — Avanzar a la siguiente ronda
Como administrador,
 quiero avanzar el torneo a la siguiente ronda cuando todos los partidos de la ronda actual estén jugados,
 para habilitar la edición de resultados de los próximos partidos.

Escenario 1 — Happy Path: avance exitoso
Given que todos los partidos de la ronda actual están marcados como "Played"
 When el administrador hace clic en "Advance to Round N"
 Then el sistema avanza la liga a la siguiente ronda
 And la nueva ronda aparece como la ronda activa

Escenario 2 — Happy Path: finalizar liga en la última ronda
Given que todos los partidos de la última ronda están jugados
 When el administrador hace clic en "Finish League"
 Then el sistema marca la liga como "Completed"
 And el badge de estado cambia a "Completed"

Escenario 3 — No Happy Path: partidos pendientes en la ronda actual
Given que quedan partidos sin jugar en la ronda actual
 When el administrador intenta avanzar
 Then el botón "Advance to Round N" permanece deshabilitado
 And se muestra el conteo de partidos pendientes (ej. "Complete 2 remaining matches to advance")

Sección: Import CSV / Excel

HU-06 — Seleccionar el tipo de datos a importar
Como administrador,
 quiero elegir si importaré jugadores o equipos antes de subir el archivo,
 para que el sistema valide las columnas correctas según el tipo seleccionado.

Escenario 1 — Happy Path: cambio de tipo limpia el estado anterior
Given que el administrador ha cargado un archivo de jugadores con vista previa activa
 When cambia el tipo a "Teams"
 Then se elimina la vista previa anterior
 And se muestran las columnas requeridas para equipos
 And el área de carga queda lista para un nuevo archivo

Escenario 2 — No Happy Path: cambio de tipo durante importación activa
Given que el administrador ha iniciado una importación
 When intenta cambiar el tipo de datos
 Then los botones de selección de tipo están deshabilitados
 And la importación continúa sin interrupciones

HU-07 — Cargar un archivo CSV o Excel
Como administrador,
 quiero subir un archivo arrastrándolo o buscándolo en mi equipo,
 para importar datos de jugadores o equipos de forma masiva.

Escenario 1 — Happy Path: archivo CSV válido cargado por drag & drop
Given que el administrador tiene un archivo .csv con el formato correcto
 When lo arrastra y suelta sobre la zona de carga
 Then el sistema procesa el archivo
 And muestra una tabla de vista previa con las filas detectadas
 And cada fila tiene el estado "Valid" o "Invalid"

Escenario 2 — Happy Path: archivo Excel cargado con clic
Given que el administrador hace clic en la zona de carga
 And selecciona un archivo .xlsx desde su explorador
 When el archivo se procesa
 Then se muestra la tabla de vista previa con los datos de la primera hoja del libro

Escenario 3 — No Happy Path: formato de archivo no soportado
Given que el administrador intenta subir un archivo con extensión .pdf o .txt
 When el archivo se evalúa
 Then el sistema muestra el error "Unsupported format. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file."
 And no se genera ninguna vista previa

Escenario 4 — No Happy Path: archivo vacío
Given que el administrador sube un archivo CSV sin filas de datos (solo encabezados o vacío)
 When el sistema lo procesa
 Then se muestra el mensaje "The file appears to be empty or has no data rows."

HU-08 — Descargar la plantilla CSV de ejemplo
Como administrador,
 quiero descargar una plantilla CSV con las columnas requeridas,
 para preparar mi archivo en el formato correcto antes de importar.

Escenario 1 — Happy Path: descarga de plantilla de jugadores
Given que el tipo de importación seleccionado es "Players"
 When el administrador hace clic en "Download template"
 Then el sistema descarga el archivo players_template.csv
 And el archivo contiene las columnas: name, age, position, number con filas de ejemplo

Escenario 2 — Happy Path: descarga de plantilla de equipos
Given que el tipo de importación seleccionado es "Teams"
 When el administrador hace clic en "Download template"
 Then el sistema descarga el archivo teams_template.csv
 And el archivo contiene las columnas: name, country, city, abbreviation, state con filas de ejemplo

HU-09 — Previsualizar y validar filas antes de importar
Como administrador,
 quiero ver qué filas son válidas o inválidas antes de confirmar la importación,
 para corregir el archivo fuente si hay errores y evitar datos inconsistentes.

Escenario 1 — Happy Path: filas válidas identificadas
Given que el administrador carga un archivo con todas las columnas correctas y valores válidos
 When el sistema analiza el archivo
 Then todas las filas muestran el badge "Valid"
 And el botón "Import N records" está habilitado

Escenario 2 — No Happy Path: fila con datos inválidos
Given que el archivo contiene un jugador con edad fuera del rango (ej. 10 años) o posición desconocida
 When el sistema valida esa fila
 Then la fila muestra el badge "Invalid"
 And se listan los errores específicos bajo la fila (ej. "Age must be a number between 15 and 50")
 And esa fila es excluida de la importación

HU-10 — Importar registros válidos al sistema
Como administrador,
 quiero importar solo las filas válidas con un clic,
 para agregar múltiples jugadores o equipos sin crearlos uno a uno.

Escenario 1 — Happy Path: importación completada sin errores
Given que la vista previa muestra al menos una fila con estado "Valid"
 When el administrador hace clic en "Import N records"
 Then el sistema importa cada fila secuencialmente
 And cada fila cambia su badge a "Imported"
 And se muestra el resumen "All N records imported successfully!"

Escenario 2 — No Happy Path: falla parcial durante la importación
Given que el sistema intenta importar varias filas válidas
 When algunas peticiones al servidor fallan
 Then las filas exitosas muestran el badge "Imported"
 And las filas fallidas muestran el badge "Failed" con el mensaje de error de la API
 And el resumen indica "N imported, M failed. Review the errors above for failed rows."

Escenario 3 — No Happy Path: sin registros válidos para importar
Given que todas las filas de la vista previa tienen estado "Invalid"
 When el administrador observa la barra de acciones
 Then el botón "Import" no está disponible
 And no se realiza ninguna petición al servidor
HU11 - Historia de Usuario — Inicio de Sesión

Descripción
Como administrador del sistema de ligas,
 Quiero poder iniciar sesión con mis credenciales,
 Para acceder al panel de administración y gestionar ligas, equipos, jugadores y partidos de forma segura.

Criterios de Aceptación

Escenario 1 — Happy Path: Inicio de sesión exitoso
Given el administrador se encuentra en la página de inicio de sesión
 And el servidor de autenticación está disponible
 When el administrador ingresa un nombre de usuario y contraseña válidos
 And hace clic en el botón "Go to Dashboard"
 Then el sistema valida las credenciales correctamente
 And redirige al administrador al panel de administración
 And almacena la sesión del usuario en el navegador

Escenario 2 — No Happy Path: Credenciales incorrectas
Given el administrador se encuentra en la página de inicio de sesión
 And el servidor de autenticación está disponible
 When el administrador ingresa un nombre de usuario o contraseña incorrectos
 And hace clic en el botón "Go to Dashboard"
 Then el sistema muestra un mensaje de error legible indicando que las credenciales son inválidas
 And el administrador permanece en la página de inicio de sesión
 And los campos de usuario y contraseña se mantienen disponibles para un nuevo intento

Escenario 3 — No Happy Path: Servidor no disponible
Given el administrador se encuentra en la página de inicio de sesión
 And el servidor de autenticación no está disponible o no responde
 When el administrador ingresa sus credenciales
 And hace clic en el botón "Go to Dashboard"
 Then el sistema muestra el mensaje: "Unable to reach the server. Please check your connection or try again later."
 And el administrador permanece en la página de inicio de sesión
 And no se almacena ninguna sesión en el navegador

Escenario 4 — No Happy Path: Campos vacíos
Given el administrador se encuentra en la página de inicio de sesión
 When el administrador no ingresa el nombre de usuario o la contraseña
 And intenta hacer clic en el botón "Go to Dashboard"
 Then el navegador impide el envío del formulario
 And señala visualmente el campo vacío como obligatorio
 And no se realiza ninguna petición al servidor

