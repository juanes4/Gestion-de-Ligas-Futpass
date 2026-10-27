# FootPass — Gestión de ligas de fútbol

Aplicación web full-stack para organizar torneos de fútbol: registra equipos y jugadores, crea ligas con calendario automático todos contra todos, registra resultados y publica la clasificación en un portal abierto al público.

Proyecto académico del curso de **Calidad de Software**, desarrollado con un plan de aseguramiento de calidad basado en **IEEE 730**.

## Funcionalidades

### Portal público (`/`)
- Resumen del torneo: estado, fechas, equipos, partidos jugados, goles y promedio por partido.
- **Destacados**: resultados de los partidos jugados con marcador final y de medio tiempo, estadio y árbitro, y etiquetas como *Remontada*, *Goleada* o *Triunfo visitante*.
- **Calendario** por jornadas con fecha, hora, estadio y estado de cada partido.
- **Clasificación** con líder, mejor ataque y mejor defensa.

### Panel de organizadores (`/dashboard`, requiere inicio de sesión)
- Alta, edición y baja de **equipos**, **jugadores**, **ligas** y **partidos**, con subida de logos y fotos.
- **Importación masiva** desde CSV o Excel (`.csv`, `.xlsx`, `.xls`) con plantillas descargables y validación por fila.
- **Creación de ligas en 3 pasos**: se registran los equipos, se crea la liga y el sistema genera el calendario todos contra todos repartiendo las jornadas entre la fecha de inicio y la de fin.
- **Gestión de partidos por jornada**: marcador, medio tiempo, estadio, árbitro y horario con guardado automático; la liga avanza de jornada solo cuando todos los partidos se han jugado.

### Reglas del torneo
- Victoria: 3 puntos · Empate: 1 punto · Derrota: 0 puntos.
- Desempate: diferencia de goles, goles a favor y resultado directo.
- Cada equipo necesita al menos 11 jugadores para inscribirse en una liga.

## Tecnologías

| Capa | Herramientas |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix UI), React Hook Form + Zod |
| Backend | Python 3.11+, Flask 3, Flask-CORS, bcrypt |
| Base de datos | SQLite |
| Importación | PapaParse (CSV), SheetJS (Excel) |

## Puesta en marcha

Requisitos: **Node.js 20+** y **Python 3.11+**.

### 1. Backend (API en `http://localhost:5000`)

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate    |    macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python run.py
```

La base de datos `backend/championship.db` incluye datos de demostración (5 equipos, 100 jugadores y 2 ligas). Para entrar al panel, crea tu usuario administrador:

```bash
python create_admin.py "Tu nombre" tu@correo.com TuContraseña
```

### 2. Frontend (en `http://localhost:3000`)

```bash
npm install
npm run dev
```

Si la API corre en otra dirección, defínela en un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Sirve la compilación de producción |

## Estructura del proyecto

```
├── app/
│   ├── (public)/          # Portal público y login
│   ├── dashboard/         # Panel de organizadores
│   └── api/upload/logo/   # Subida de imágenes
├── components/
│   ├── public/            # Secciones del portal público
│   ├── management/        # Tablas de gestión (equipos, jugadores, ligas, partidos)
│   ├── forms/             # Formularios reutilizables
│   └── ui/                # Componentes base (shadcn/ui)
├── lib/
│   ├── api.ts             # Cliente tipado de la API
│   ├── hooks/             # Hooks de estado (partidos de liga, autoguardado, plantilla de jugadores)
│   ├── import/            # Parsers y validadores de la importación masiva
│   └── validation/        # Validadores de dominio
├── backend/
│   ├── run.py             # Punto de entrada de la API
│   ├── create_admin.py    # Alta de administradores
│   └── src/
│       ├── routes.py      # Endpoints REST
│       ├── services.py    # Calendario, clasificación y resultados
│       └── database.py    # Esquema y conexión SQLite
└── docs/                  # Plan de calidad e historias de usuario
```

## API REST

Todas las rutas cuelgan de `/api`. Detalle de cuerpos y respuestas en [backend/README.md](backend/README.md).

| Recurso | Endpoints |
|---|---|
| Equipos | `GET/POST /teams` · `GET/PUT/DELETE /teams/:id` · `POST /teams/:id/players` |
| Jugadores | `GET/POST /players` · `PUT/DELETE /players/:id` |
| Ligas | `GET/POST /leagues` · `GET/PUT/DELETE /leagues/:id` · `GET /leagues/:id/rounds` · `GET /leagues/:id/standings` · `POST /leagues/:id/advance-round` · `POST /leagues/:id/generate-groups` |
| Partidos | `GET/POST /matches` · `GET/PATCH/DELETE /matches/:id` · `PUT /matches/:id/result` |
| Sesión | `POST /login` |

## Aseguramiento de calidad

- [Plan SQAP (IEEE 730)](docs/SQAP-IEEE730.md): roles, estándares de código, métricas, revisiones, 41 casos de prueba en 6 módulos, gestión de defectos y registro de riesgos.
- [Historias de usuario](docs/historias-usuario.md) y su [versión refinada](docs/historias-usuario-refinadas.md) con escenarios Gherkin.
- Flujo de trabajo con ramas por funcionalidad y pull requests revisados antes de integrar en `main`.
