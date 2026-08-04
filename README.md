# Cypress Automation

Suite de pruebas end-to-end para los flujos de autenticación, inventario y carrito de [SauceDemo](https://www.saucedemo.com). El proyecto combina Cypress, Cucumber/Gherkin y Page Object Model (POM), genera evidencias de ejecución y ejecuta una suite smoke automáticamente en pull requests dirigidos a `master`.

## Alcance actual

La suite contiene nueve escenarios:

| Área | Escenarios cubiertos |
|---|---|
| Login | Acceso exitoso, usuario bloqueado y credenciales inválidas |
| Inventario | Cantidad disponible, orden por precio y detalle de producto |
| Carrito | Agregar, visualizar y eliminar productos desde carrito o inventario |

La aplicación bajo prueba se configura mediante `baseUrl` como `https://www.saucedemo.com`.

Los escenarios se clasifican con:

- `@smoke`: recorrido crítico de login, inventario y carrito.
- `@regression`: conjunto funcional completo.

## Tecnologías

| Tecnología | Uso |
|---|---|
| Cypress 15 | Ejecución y aserciones end-to-end |
| Cucumber/Gherkin | Especificación legible de escenarios funcionales |
| Badeball Cucumber Preprocessor | Integración entre archivos `.feature` y Cypress |
| Esbuild Preprocessor | Compilación de los archivos de prueba |
| Page Object Model | Separación de selectores, acciones y lógica de negocio |
| Multiple Cucumber HTML Reporter | Generación del reporte HTML |
| Husky 9 | Validación de Steps duplicados antes del push |
| GitHub Actions | Ejecución automatizada y publicación de artefactos |

Los scripts de Node.js utilizan CommonJS. Los archivos cargados por Cypress utilizan imports ES Modules y son procesados por Esbuild.

## Arquitectura

```text
Feature en Gherkin
        │
        ▼
Step Definitions ──► Page Object ──► Aplicación SauceDemo
        │                  │
        │                  └── selectores, acciones y aserciones
        └── parámetros y correspondencia entre lenguaje funcional y código
```

### Estructura del repositorio

```text
.
├── .github
│   └── workflows
│       └── cypress.yml
├── .husky
│   └── pre-push
├── cypress
│   ├── e2e
│   │   ├── features
│   │   │   ├── sauceCart.feature
│   │   │   ├── sauceInventory.feature
│   │   │   └── sauceLogin.feature
│   │   ├── pages
│   │   │   ├── sauceCart.js
│   │   │   ├── sauceInventory.js
│   │   │   └── sauceLogin.js
│   │   └── step_definitions
│   │       ├── sauceCartStep.js
│   │       ├── sauceInventoryStep.js
│   │       └── sauceLoginStep.js
│   ├── fixtures
│   │   ├── products.json
│   │   └── users.json
│   └── support
│       ├── commands.js
│       └── e2e.js
├── docs
│   └── prompt-validacion-steps-husky.md
├── scripts
│   ├── generate-cucumber-report.js
│   └── validate-steps.js
├── .gitignore
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

### Componentes principales

#### Feature

Los archivos de `cypress/e2e/features` contienen las especificaciones funcionales en Gherkin:

- `sauceLogin.feature`: autenticación positiva y negativa.
- `sauceInventory.feature`: listado, orden y detalle.
- `sauceCart.feature`: alta, consulta y eliminación de productos.

Los `Background` de inventario y carrito reutilizan el login configurado antes de cada escenario.

#### Step Definitions

Los archivos de `cypress/e2e/step_definitions` conectan Gherkin con los Page Objects. Los Steps reciben parámetros legibles, consultan fixtures cuando corresponde y delegan las interacciones; no contienen selectores de la interfaz.

#### Page Object

Los Page Objects centralizan:

- `sauceLogin.js`: autenticación y validación de errores.
- `sauceInventory.js`: productos, ordenamiento, detalle y badge del carrito.
- `sauceCart.js`: contenido del carrito y eliminación de productos.

Cada Page Object utiliza selectores `data-test` y exporta una instancia reutilizable. Los escenarios no acceden directamente a selectores de la interfaz.

#### Fixtures

- `users.json`: credenciales por tipo de usuario (`standard`, `locked` e `invalid`).
- `products.json`: nombre, precio y descripción de los productos utilizados.

Los fixtures evitan repetir datos técnicos en múltiples archivos y permiten validar que la clave solicitada por un Step exista.

#### Support

`cypress/support/e2e.js` carga `commands.js` antes de los tests. Actualmente `commands.js` está preparado para incorporar comandos personalizados de Cypress, pero no define ninguno.

#### Scripts auxiliares

- `scripts/generate-cucumber-report.js`: genera el reporte HTML desde los JSON de Cucumber.
- `scripts/validate-steps.js`: busca Step Definitions duplicados en el código de Cypress.

## Requisitos

- Git.
- Node.js y npm.
- Acceso a `https://www.saucedemo.com` para ejecutar las pruebas.

GitHub Actions utiliza Node.js 24. Se recomienda usar la misma versión principal localmente para minimizar diferencias con CI.

```bash
node --version
npm --version
git --version
```

## Instalación

```bash
git clone https://github.com/AlexanderTincopa/CypressAutomation.git
cd CypressAutomation
npm install
```

`npm install` instala las dependencias declaradas, actualiza el lockfile cuando corresponde y ejecuta `prepare`, que activa los hooks de Husky en el repositorio local.

No es necesario crear un archivo `.env` para los escenarios actuales: la URL está en la configuración y los datos reutilizables están en `cypress/fixtures`.

## Configuración de Cypress

La configuración reside en `cypress.config.js`:

| Propiedad | Valor/propósito |
|---|---|
| `baseUrl` | `https://www.saucedemo.com` |
| `specPattern` | `cypress/e2e/features/**/*.feature` |
| `supportFile` | `cypress/support/e2e.js` |
| `video` | Habilitado |
| `videosFolder` | `cypress/videos` |
| `screenshotsFolder` | `cypress/screenshots` |
| `videoCompression` | `32` |
| `screenshotOnRunFailure` | Habilitado |

`setupNodeEvents` registra el preprocesador de Cucumber y el bundler de Esbuild para que Cypress pueda ejecutar directamente los archivos `.feature`.

## Ejecución de pruebas

### Suite smoke

```bash
npm run test:smoke
```

Ejecuta los tres escenarios críticos etiquetados con `@smoke`.

### Regresión completa

```bash
npm run test:regression
```

### Todas las pruebas

```bash
npm run test:all
```

### Ejecución por funcionalidad

```bash
npm run test:login
npm run test:inventory
npm run test:cart
```

### Interfaz interactiva de Cypress

Para depuración local:

```bash
npx cypress open
```

Selecciona pruebas E2E y después la feature que quieras ejecutar.

### Flujo de una ejecución

1. Cypress encuentra los `.feature` mediante `specPattern`.
2. El preprocesador interpreta los escenarios Gherkin.
3. Cada frase se enlaza con su Step Definition.
4. El Step llama a un método del Page Object.
5. Cypress interactúa con SauceDemo y evalúa las aserciones.
6. Ante fallos se conserva una captura; durante la ejecución headless se genera video.
7. Los resultados JSON sirven como entrada para el reporte HTML.

## Reportes y evidencias

Genera el reporte después de ejecutar la suite:

```bash
npm run report:cucumber
```

Rutas utilizadas:

| Evidencia | Ruta |
|---|---|
| JSON de Cucumber | `reports/cucumber-json/` |
| Reporte HTML | `reports/cucumber-html/` |
| Videos | `cypress/videos/` |
| Capturas ante fallos | `cypress/screenshots/` |
| Descargas | `cypress/downloads/` |

El reporte muestra duración, proyecto, suite, framework, comando, plataforma y contexto de ejecución. El sistema operativo se obtiene dinámicamente; CI identifica el runner de GitHub Actions y proporciona el nombre de la suite y el comando mediante variables de entorno.

Las carpetas de reportes y evidencias están excluidas de Git mediante `.gitignore`.

## Scripts npm

| Comando | Descripción |
|---|---|
| `npm run test:all` | Ejecuta todas las features |
| `npm run test:smoke` | Ejecuta escenarios con `@smoke` |
| `npm run test:regression` | Ejecuta escenarios con `@regression` |
| `npm run test:login` | Ejecuta la feature de login en modo headless |
| `npm run test:inventory` | Ejecuta la feature de inventario |
| `npm run test:cart` | Ejecuta la feature de carrito |
| `npm run report:cucumber` | Genera el reporte HTML de Cucumber |
| `npm run validate:steps` | Detecta Step Definitions duplicados |
| `npm run prepare` | Inicializa Husky en el repositorio local |

## Validación de Step Definitions

Ejecuta manualmente:

```bash
npm run validate:steps
```

El script recorre recursivamente `cypress` y revisa archivos `.js`, `.jsx`, `.ts` y `.tsx`. Reconoce `Given`, `When`, `Then` y `defineStep`, con expresiones estáticas escritas como strings, template literals o expresiones regulares.

La comparación no usa el tipo de Step como diferenciador. Por ejemplo, un `Given` y un `Then` con la misma expresión textual se consideran duplicados. El resultado incluye expresión, tipo, archivo y línea:

- Sin duplicados: código de salida `0`.
- Con duplicados: código de salida `1` y push bloqueado.
- Error inesperado: código de salida `1`.

### Limitaciones del validador

- No resuelve variables, concatenaciones ni templates con `${...}`.
- No resuelve aliases utilizados al importar los métodos de Cucumber.
- Es un analizador estático ligero, no un parser completo de JavaScript o TypeScript.
- Las expresiones regulares se comparan como literales, incluyendo sus flags.

## Hook pre-push con Husky

`.husky/pre-push` ejecuta automáticamente:

```sh
npm run validate:steps
```

Husky es una protección local: cada persona debe activarlo al instalar el proyecto. Confirma su configuración con:

```bash
git config --get core.hooksPath
```

El resultado esperado con Husky 9 es:

```text
.husky/_
```

Comprueba el hook sin publicar cambios:

```bash
git hook run pre-push
```

Si el validador funciona manualmente pero el push no lo ejecuta, usa:

```bash
npm install
```

Si Husky ya está instalado pero no fue activado:

```bash
npm run prepare
```

La existencia de `.husky/pre-push` por sí sola no garantiza que Git esté usando el hook; `core.hooksPath` debe estar configurado.

## Integración continua

El workflow `.github/workflows/cypress.yml` se activa:

- Manualmente mediante `workflow_dispatch`.
- En pull requests dirigidos a `master`.

El job `cypress-run` se ejecuta sobre Ubuntu y realiza:

1. Checkout del repositorio.
2. Configuración de Node.js 24 con caché de npm.
3. Instalación reproducible con `npm ci`.
4. Ejecución de `npm run test:smoke`.
5. Generación del reporte, incluso si las pruebas fallan.
6. Creación de un resumen en GitHub Actions.
7. Publicación de reportes JSON/HTML y videos.
8. Publicación de screenshots únicamente ante fallos.

La validación de Steps duplicados permanece en el hook local y no forma parte del YAML actual.

## Flujo de contribución

Trabaja en una rama separada de `master`:

```bash
git switch master
git pull --ff-only
git switch -c usuario/descripcion-cambio
```

Antes de publicar:

```bash
npm run validate:steps
npm run test:smoke
git status
git diff
```

Añade únicamente los archivos esperados, crea el commit y publica la rama:

```bash
git add <archivos>
git commit -m "Descripción del cambio"
git push -u origin usuario/descripcion-cambio
```

Husky repetirá la validación de Steps durante el push. Cuando la rama esté lista, crea un pull request hacia `master`; GitHub Actions ejecutará la suite.

## Cómo ampliar la suite

### Agregar un escenario al flujo existente

1. Añade el escenario a la feature correspondiente.
2. Reutiliza Steps existentes siempre que expresen la misma intención.
3. Añade al Page Object los selectores o comportamientos nuevos.
4. Crea un Step nuevo únicamente cuando no exista uno equivalente.
5. Ejecuta el validador y las pruebas.

### Agregar una funcionalidad nueva

Mantén la separación del proyecto:

```text
cypress/e2e/features/nuevaFuncionalidad.feature
cypress/e2e/pages/nuevaFuncionalidad.js
cypress/e2e/step_definitions/nuevaFuncionalidadStep.js
```

Usa selectores estables —preferentemente atributos `data-test`— y evita colocar selectores o cadenas largas de comandos Cypress directamente en los archivos `.feature` o en los Step Definitions.

## Solución de problemas

### Cypress no encuentra la feature

Comprueba que el archivo tenga extensión `.feature` y esté bajo `cypress/e2e/features`, que es la ruta cubierta por `specPattern`.

### Un Step aparece como indefinido

- Confirma que el texto de la feature coincide con la expresión del Step.
- Revisa los parámetros `{string}`.
- Confirma que el archivo esté bajo la estructura cargada por el preprocesador.

### No se genera el reporte HTML

- Ejecuta primero la suite para producir los JSON.
- Comprueba que existan archivos en `reports/cucumber-json`.
- Después ejecuta `npm run report:cucumber`.

### El push no ejecuta el validador

Comprueba `git config --get core.hooksPath`. Si no devuelve `.husky/_`, ejecuta `npm install` o `npm run prepare`.

### Diferencias entre local y CI

- Utiliza Node.js 24.
- Conserva `package-lock.json` actualizado.
- Usa `npm ci` cuando quieras reproducir estrictamente las versiones del lockfile.
- Recuerda que el runner de CI usa Ubuntu y la ejecución local usa tu sistema operativo.

## Archivos que no deben versionarse

`.gitignore` excluye dependencias, evidencias, reportes, archivos `.env`, logs de npm/yarn y archivos propios del sistema operativo. No añadas esos archivos de forma forzada salvo que exista una razón documentada.

## Licencia

El proyecto declara licencia ISC en `package.json`.
