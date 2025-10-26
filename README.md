# Aplicación de Cuestionarios

Una aplicación de cuestionarios moderna e interactiva construida con SvelteKit v5, que presenta preguntas de opción múltiple con selección aleatoria.

## Características

- 🎯 Preguntas de opción múltiple
- 📊 Seguimiento de progreso con barra visual
- ✅ Retroalimentación instantánea con explicaciones
- 📈 Seguimiento de puntuación y resultados finales
- 📋 Revisión de respuestas al finalizar
- 🔄 Funcionalidad de reinicio
- 📱 Diseño responsivo
- 🎲 Selección aleatoria de 10 preguntas por cuestionario
- 🗂️ Múltiples cuestionarios con navegación

## Inicio Rápido

### Requisitos Previos

Necesitas tener los siguientes programas instalados en tu sistema:

- [Git](https://git-scm.com/) - Sistema de control de versiones
- [Bun](https://bun.sh) - Runtime de JavaScript y gestor de paquetes

#### Instalación de Git

**Windows:**

1. Descarga el instalador desde [git-scm.com/download/win](https://git-scm.com/download/win)
2. Ejecuta el instalador descargado
3. Sigue el asistente de instalación (se recomienda mantener las opciones por defecto)
4. Verifica la instalación abriendo PowerShell o CMD:
   ```powershell
   git --version
   ```

Alternativamente, puedes usar winget:

```powershell
winget install --id Git.Git -e --source winget
```

**macOS:**

Git viene preinstalado en la mayoría de versiones de macOS. Si no lo tienes, puedes instalarlo de varias formas:

Usando Homebrew (recomendado):

```bash
brew install git
```

O instalando las Xcode Command Line Tools:

```bash
xcode-select --install
```

Verifica la instalación:

```bash
git --version
```

**Linux:**

La instalación depende de tu distribución:

Debian/Ubuntu:

```bash
sudo apt update
sudo apt install git
```

Fedora:

```bash
sudo dnf install git
```

Arch Linux:

```bash
sudo pacman -S git
```

Verifica la instalación:

```bash
git --version
```

#### Instalación de Bun

**Windows:**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS:**

```bash
curl -fsSL https://bun.sh/install | bash
```

**Linux:**

```bash
curl -fsSL https://bun.sh/install | bash
```

Después de la instalación, reinicia tu terminal y verifica con:

```bash
bun --version
```

### Configuración del Proyecto

1. **Clonar el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd quiz
   ```

2. **Instalar dependencias:**

   ```bash
   bun install
   ```

3. **Ejecutar servidor de desarrollo:**

   ```bash
   bun run dev
   ```

4. **Abrir tu navegador en:** `http://localhost:5173`

## Gestión de Cuestionarios

### Agregar un Nuevo Cuestionario

1. **Crear archivo JSON en `static/quizzes/`:**

   ```json
   {
   	"id": "mi-cuestionario-123",
   	"title": "Mi Cuestionario",
   	"description": "Descripción del cuestionario",
   	"icon": "📚",
   	"questions": [
   		{
   			"id": 1,
   			"type": "multiple_choice",
   			"question": "¿Tu pregunta aquí?",
   			"options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
   			"correctAnswer": 2,
   			"explanation": "Explicación de la respuesta correcta."
   		}
   	]
   }
   ```

2. **Regenerar el índice:**

   ```bash
   bun run generate-quiz-index
   ```

### Estructura de Preguntas

Cada pregunta debe seguir esta estructura:

- `id` (número): Identificador único de la pregunta
- `type` (string): Tipo de pregunta (actualmente solo "multiple_choice")
- `question` (string): El texto de la pregunta
- `options` (array): Array de opciones de respuesta
- `correctAnswer` (número): Índice de la respuesta correcta (0-based)
- `explanation` (string): Explicación de por qué es correcta

### Metadata del Cuestionario

Cada archivo de cuestionario puede incluir metadata opcional:

- `id` (string): ID único del cuestionario (recomendado: UUID)
- `title` (string): Título mostrado en la interfaz
- `description` (string): Descripción breve del cuestionario
- `icon` (string): Emoji o icono representativo

## Comandos Disponibles

- `bun run dev` - Iniciar servidor de desarrollo
- `bun run build` - Construir para producción
- `bun run preview` - Previsualizar construcción de producción
- `bun run check` - Ejecutar verificación de tipos
- `bun run format` - Formatear código con Prettier
- `bun run lint` - Verificar código con ESLint
- `bun run generate-quiz-index` - Regenerar índice de cuestionarios

## Tecnologías Utilizadas

- **SvelteKit v5** - Framework full-stack
- **TypeScript** - Seguridad de tipos
- **Bun** - Runtime y gestor de paquetes
- **Vite** - Herramienta de construcción
- **CSS Custom Properties** - Tematización

## Características Principales

### Aleatorización de Preguntas

Cada vez que un usuario inicia un cuestionario:

- Se mezclan todas las preguntas disponibles
- Se seleccionan aleatoriamente 10 preguntas
- Esto permite cuestionarios con más de 10 preguntas que varían en cada intento

### Navegación de Cuestionarios

- Pantalla principal muestra todos los cuestionarios disponibles
- Cada tarjeta de cuestionario muestra:
  - Icono del cuestionario
  - Título y descripción
  - Categoría
  - Número de preguntas
- Diseño inspirado en Hugging Face

### Retroalimentación Inmediata

- Feedback instantáneo después de cada respuesta
- Explicación detallada de la respuesta correcta
- Indicador visual de respuestas correctas e incorrectas

## Despliegue

Este proyecto está configurado para desplegarse en Cloudflare Pages usando el adaptador `@sveltejs/adapter-cloudflare`.

Para desplegar:

```bash
bun run build
```

Los archivos de producción estarán en el directorio `.svelte-kit/cloudflare`.

## Contribuir

1. Crea nuevos cuestionarios en `static/quizzes/`
2. Ejecuta `bun run generate-quiz-index` para actualizar el índice
3. Prueba tus cambios con `bun run dev`
4. Formatea tu código con `bun run format`

¡Disfruta creando tus cuestionarios! 🦉
