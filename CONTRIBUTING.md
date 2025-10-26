# Guía Completa para Contribuir al Proyecto Quiz

## 📋 Requisitos Previos

Antes de comenzar, necesitas tener instalados los siguientes programas en tu sistema:

### Git

**Windows:**

1. Descarga el instalador desde [git-scm.com/download/win](https://git-scm.com/download/win)
2. Ejecuta el instalador descargado
3. Sigue el asistente de instalación (se recomienda mantener las opciones por defecto)
4. Verifica la instalación abriendo PowerShell o CMD:
   ```bash
   git --version
   ```

**macOS:**
Git viene preinstalado en la mayoría de versiones de macOS. Si no lo tienes:

```bash
# Usando Homebrew (recomendado)
brew install git

# O instalando Xcode Command Line Tools
xcode-select --install
```

**Linux:**

```bash
# Debian/Ubuntu
sudo apt update
sudo apt install git

# Fedora
sudo dnf install git

# Arch Linux
sudo pacman -S git
```

### Bun (Runtime y gestor de paquetes)

**Windows:**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS y Linux:**

```bash
curl -fsSL https://bun.sh/install | bash
```

Después de la instalación, reinicia tu terminal y verifica:

```bash
bun --version
```

## 🚀 Cómo Clonar y Configurar el Repositorio

### 1. Clonar el repositorio

```bash
git clone https://github.com/Davante-MEDAC/quiz.git
```

### 2. Navegar al directorio del proyecto

```bash
cd quiz
```

### 3. Instalar dependencias

```bash
bun install
```

### 4. Ejecutar el servidor de desarrollo

```bash
bun run dev
```

### 5. Abrir en el navegador

Visita: http://localhost:5173

## 📁 Comandos Básicos de Terminal

### Navegación básica:

```bash
# Ver contenido del directorio actual
ls                    # Linux/macOS
dir                   # Windows

# Navegar a un directorio
cd nombre-directorio

# Volver al directorio anterior
cd ..

# Ver ruta actual
pwd                   # Linux/macOS
cd                    # Windows

# Crear directorio
mkdir nombre-directorio
```

### Comandos de Git básicos:

```bash
# Ver estado del repositorio
git status

# Agregar cambios al staging
git add .                    # Agregar todos los archivos
git add archivo.json         # Agregar archivo específico

# Hacer commit de los cambios
git commit -m "Descripción del cambio"

# Subir cambios al repositorio
git push origin main

# Actualizar repositorio local
git pull origin main

# Ver historial de commits
git log --oneline
```

### Comandos específicos del proyecto:

```bash
# Iniciar servidor de desarrollo
bun run dev

# Construir para producción
bun run build

# Ejecutar verificaciones
bun run check

# Formatear código
bun run format

# Verificar código con linter
bun run lint

# Regenerar índice de cuestionarios (IMPORTANTE después de agregar preguntas)
bun run generate-quiz-index
```

## 📝 Cómo Agregar Preguntas al Archivo bases-de-datos.json

### Ubicación del archivo:

```
static/quizzes/bases-de-datos.json
```

### Estructura del archivo JSON:

El archivo sigue esta estructura general:

```json
{
	"id": "bases-de-datos-123",
	"title": "Bases de Datos",
	"description": "Preguntas sobre conceptos fundamentales de bases de datos",
	"icon": "🗄️",
	"questions": [
		{
			"id": 1,
			"type": "multiple_choice",
			"question": "¿Qué es una base de datos relacional?",
			"options": [
				"Un conjunto de archivos independientes",
				"Una colección de datos organizados en tablas relacionadas",
				"Un tipo de software de presentaciones",
				"Una herramienta de desarrollo web"
			],
			"correctAnswer": 1,
			"explanation": "Una base de datos relacional organiza los datos en tablas que pueden relacionarse entre sí mediante claves."
		}
	]
}
```

### Pasos para agregar nuevas preguntas:

#### 1. Abrir el archivo JSON

```bash
# Desde el directorio del proyecto
code static/quizzes/bases-de-datos.json    # Visual Studio Code
nano static/quizzes/bases-de-datos.json    # Editor nano (Linux/macOS)
notepad static/quizzes/bases-de-datos.json # Notepad (Windows)
```

#### 2. Estructura de una pregunta

Cada pregunta debe seguir exactamente esta estructura:

```json
{
  "id": [NÚMERO_ÚNICO],
  "type": "multiple_choice",
  "question": "[TEXTO_DE_LA_PREGUNTA]",
  "options": [
    "[OPCIÓN_1]",
    "[OPCIÓN_2]",
    "[OPCIÓN_3]",
    "[OPCIÓN_4]"
  ],
  "correctAnswer": [ÍNDICE_RESPUESTA_CORRECTA],
  "explanation": "[EXPLICACIÓN_DE_LA_RESPUESTA]"
}
```

#### 3. Campos explicados:

- **id**: Número único e incremental (si la última pregunta tiene id: 25, la nueva será 26)
- **type**: Siempre "multiple_choice" (por ahora es el único tipo soportado)
- **question**: El texto de la pregunta
- **options**: Array con exactamente 4 opciones de respuesta
- **correctAnswer**: Índice de la respuesta correcta (0 = primera opción, 1 = segunda, etc.)
- **explanation**: Explicación clara de por qué esa respuesta es correcta

#### 4. Ejemplo de pregunta nueva:

```json
{
	"id": 26,
	"type": "multiple_choice",
	"question": "¿Cuál es la diferencia entre DELETE y TRUNCATE en SQL?",
	"options": [
		"No hay diferencia, son sinónimos",
		"DELETE elimina filas específicas, TRUNCATE elimina todas las filas más rápido",
		"TRUNCATE solo funciona con vistas",
		"DELETE es más rápido que TRUNCATE"
	],
	"correctAnswer": 1,
	"explanation": "DELETE permite eliminar filas específicas con WHERE, mientras que TRUNCATE elimina todas las filas de la tabla de forma más eficiente pero sin posibilidad de filtrar."
}
```

#### 5. Cómo agregar la pregunta:

1. Localiza el final del array "questions" en el archivo JSON
2. Antes del corchete de cierre `]`, agrega una coma después de la última pregunta
3. Inserta tu nueva pregunta siguiendo la estructura exacta
4. Guarda el archivo

**Ejemplo visual:**

```json
{
	"questions": [
		// ... preguntas existentes ...
		{
			"id": 25,
			"type": "multiple_choice",
			"question": "Pregunta anterior...",
			"options": ["...", "...", "...", "..."],
			"correctAnswer": 2,
			"explanation": "..."
		},
		{
			"id": 26,
			"type": "multiple_choice",
			"question": "Tu nueva pregunta aquí...",
			"options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
			"correctAnswer": 1,
			"explanation": "Tu explicación aquí..."
		}
	]
}
```

## ✅ Proceso Completo de Contribución

### 1. Preparar tu entorno:

```bash
# Clonar y configurar (solo la primera vez)
git clone https://github.com/Davante-MEDAC/quiz.git
cd quiz
bun install
```

### 2. Hacer tus cambios:

```bash
# Abrir el archivo JSON
code static/quizzes/bases-de-datos.json

# Agregar tus preguntas siguiendo la estructura explicada
```

### 3. Probar tus cambios:

```bash
# Regenerar el índice de cuestionarios
bun run generate-quiz-index

# Iniciar servidor de desarrollo
bun run dev

# Visitar http://localhost:5173 y probar el cuestionario
```

### 4. Verificar y formatear:

```bash
# Verificar que no hay errores
bun run check

# Formatear el código
bun run format

# Verificar con linter
bun run lint
```

### 5. Enviar tus cambios:

```bash
# Ver qué archivos cambiaron
git status

# Agregar archivos modificados
git add static/quizzes/bases-de-datos.json
git add src/lib/quizzes.ts  # Si se generó automáticamente

# Hacer commit
git commit -m "Agregar [número] nuevas preguntas de bases de datos"

# Subir cambios (si tienes permisos) o crear Pull Request
git push origin main
```

## ⚠️ Consideraciones Importantes

### Validación JSON:

- **Siempre** verifica que tu JSON sea válido
- Usa herramientas online como jsonlint.com si tienes dudas
- Presta atención a las comas, corchetes y comillas

### Buenas prácticas para preguntas:

- Haz preguntas claras y específicas
- Evita preguntas ambiguas
- Asegúrate de que solo haya una respuesta claramente correcta
- Proporciona explicaciones educativas y útiles
- Usa un nivel de dificultad apropiado para el tema

### IDs únicos:

- Siempre usa el siguiente número disponible para el ID
- No reutilices IDs existentes
- Mantén la secuencia numérica

### Regenerar índice:

- **SIEMPRE** ejecuta `bun run generate-quiz-index` después de agregar preguntas
- Esto actualiza el sistema para reconocer tus nuevas preguntas

## 🔧 Solución de Problemas

### Error de JSON inválido:

```bash
# Si el servidor no inicia o hay errores, verifica el JSON
bun run check
```

### Preguntas no aparecen:

```bash
# Regenera el índice
bun run generate-quiz-index
```

### Problemas de permisos:

```bash
# Si no puedes hacer push directamente, crea un fork del repositorio
# y luego haz un Pull Request
```

## 📞 Ayuda Adicional

Si encuentras problemas:

1. Revisa que tu JSON esté bien formateado
2. Asegúrate de haber ejecutado `bun run generate-quiz-index`
3. Verifica que el servidor de desarrollo esté funcionando
4. Consulta la documentación del proyecto en GitHub

¡Gracias por contribuir al proyecto! 🎉
