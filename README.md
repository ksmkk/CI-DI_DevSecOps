# CI-DI DevSecOps — GitHub Actions

Proyecto académico de implementación de un pipeline **CI/CD con enfoque DevSecOps**, utilizando **GitHub Actions**, análisis de seguridad, control de calidad de código, pruebas automatizadas, construcción de artefactos, escaneo de contenedores y despliegue simulado por ambientes.

Repositorio: `ksmkk/CI-DI_DevSecOps`

---

## Objetivo del proyecto

El objetivo principal de este proyecto es demostrar la integración de prácticas DevSecOps dentro de un flujo de desarrollo moderno, automatizando controles de calidad, seguridad y despliegue mediante GitHub Actions.

El pipeline implementado permite validar código antes de integrarlo, detectar vulnerabilidades en dependencias, identificar secretos expuestos, analizar código fuente, escanear imágenes Docker y controlar el paso hacia ambientes de staging y producción.

---

## Tecnologías utilizadas

* Node.js
* Express
* Jest
* Supertest
* ESLint
* Docker
* GitHub Actions
* CodeQL
* npm audit
* Gitleaks
* Trivy
* OWASP ZAP
* Dependabot
* GitHub Container Registry
* Slack Webhook para notificaciones

---

## Estructura del repositorio

```txt
CI-DI_DevSecOps/
│
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       ├── security.yml
│       └── cd.yml
│
├── src/
│   └── index.js
│
├── tests/
│   └── health.test.js
│
├── scripts/
│   └── build.js
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── eslint.config.js
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Aplicación

La aplicación corresponde a una API básica construida con Express.

Endpoints principales:

```txt
GET /
GET /health
```

El endpoint `/health` se utiliza para validar el estado de la aplicación dentro del pipeline y también durante la ejecución de pruebas automatizadas y análisis dinámico.

---

## Instalación local

```bash
npm install
```

---

## Ejecutar aplicación en desarrollo

```bash
npm run dev
```

---

## Ejecutar pruebas

```bash
npm test
```

---

## Ejecutar pruebas con cobertura

```bash
npm test -- --coverage
```

El proyecto exige una cobertura mínima del 80% mediante configuración de Jest.

---

## Ejecutar análisis estático

```bash
npm run lint
```

El análisis estático se realiza con ESLint y bloquea el pipeline cuando se detectan errores de calidad de código.

---

## Ejecutar build

```bash
npm run build
```

El build copia los archivos fuente hacia la carpeta `dist/`, generando el artefacto que será utilizado en etapas posteriores.

---

# Workflows implementados

## 1. CI — Integración Continua

Archivo:

```txt
.github/workflows/ci.yml
```

Este workflow se ejecuta ante cambios en las ramas `main` y `develop`, además de Pull Requests hacia `main`.

Etapas implementadas:

1. Instalación de dependencias con `npm ci`.
2. Análisis estático con ESLint.
3. Ejecución de pruebas unitarias con Jest.
4. Validación de cobertura mínima.
5. Compilación del artefacto.
6. Carga del artefacto como evidencia del pipeline.

Este workflow impide que código con errores de estilo, pruebas fallidas o baja cobertura avance hacia etapas posteriores.

---

## 2. Security — Análisis de seguridad

Archivo:

```txt
.github/workflows/security.yml
```

Este workflow incorpora controles de seguridad automatizados dentro del ciclo de desarrollo.

Controles implementados:

### CodeQL

Realiza análisis estático de seguridad sobre el código fuente, permitiendo detectar patrones inseguros, malas prácticas y posibles vulnerabilidades.

### npm audit

Realiza análisis de composición de software sobre las dependencias del proyecto. El pipeline falla si se detectan vulnerabilidades de severidad alta o crítica.

### Gitleaks

Detecta secretos, credenciales o tokens expuestos accidentalmente dentro del repositorio.

### OWASP ZAP

Ejecuta análisis dinámico básico sobre la aplicación levantada durante el pipeline, validando posibles riesgos de seguridad en tiempo de ejecución.

### Notificación Slack

Cada job de seguridad incorpora una notificación hacia Slack en caso de fallo, utilizando un webhook almacenado como secreto de GitHub.

---

## 3. CD — Entrega y despliegue continuo

Archivo:

```txt
.github/workflows/cd.yml
```

Este workflow se ejecuta mediante tags semánticos, por ejemplo:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Etapas implementadas:

1. Escaneo de imagen Docker con Trivy.
2. Construcción de imagen Docker.
3. Publicación de imagen en GitHub Container Registry.
4. Despliegue simulado a ambiente staging.
5. Despliegue simulado a ambiente production.

El despliegue a producción queda protegido mediante ambientes de GitHub, permitiendo aplicar aprobación manual antes de avanzar.

---

# Seguridad implementada

## Gestión de secretos

Los secretos del proyecto no se almacenan directamente en el repositorio. Se utilizan GitHub Secrets para proteger valores sensibles como:

```txt
SLACK_WEBHOOK_URL
GITHUB_TOKEN
```

El archivo `.env` no debe ser subido al repositorio.

---

## Dependabot

Archivo:

```txt
.github/dependabot.yml
```

Dependabot se configuró para revisar actualizaciones de:

* Dependencias npm.
* GitHub Actions.

Esto permite mantener el proyecto actualizado y reducir el riesgo asociado a dependencias vulnerables.

---

## Dockerfile seguro

El proyecto utiliza una imagen Docker basada en Node.js y aplica buenas prácticas como:

* Imagen base ligera.
* Instalación solo de dependencias necesarias.
* Uso de usuario no root.
* Separación de etapas.
* Healthcheck.
* Exclusión de archivos sensibles mediante `.dockerignore`.

---

# Evidencias rojas realizadas

Durante el desarrollo del proyecto se realizaron pruebas controladas para validar que el pipeline bloquea cambios inseguros o defectuosos.

## Evidencia roja 01 — Trivy bloquea imagen vulnerable

Se ejecutó el workflow de CD mediante un tag semántico. El job de Trivy detectó vulnerabilidades de severidad alta y crítica en la imagen Docker, por lo que el pipeline falló antes de continuar con las etapas de despliegue.

Resultado esperado:

```txt
Container Scan — Trivy
HIGH / CRITICAL vulnerabilities detected
Process completed with exit code 1
```

---

## Evidencia roja 02 — ESLint bloquea código con mala calidad

Se agregó intencionalmente una variable no utilizada en el código fuente.

Resultado esperado:

```txt
no-unused-vars
'variableSinUsar' is assigned a value but never used
Process completed with exit code 1
```

Esta prueba demuestra que el pipeline bloquea código que no cumple con las reglas de calidad definidas.

---

## Evidencia roja 03 — Jest bloquea prueba unitaria fallida

Se modificó intencionalmente una prueba para esperar un valor incorrecto en el endpoint `/health`.

Resultado esperado:

```txt
Expected: "fail"
Received: "ok"
Process completed with exit code 1
```

Esta evidencia demuestra que el pipeline impide avanzar cuando las pruebas automatizadas fallan.

---

## Evidencia roja 04 — npm audit bloquea dependencia vulnerable

Se agregó intencionalmente una versión vulnerable de `lodash`.

Resultado esperado:

```txt
lodash
critical severity vulnerability
npm audit --audit-level=high
Process completed with exit code 1
```

Esta prueba demuestra que el pipeline detecta dependencias vulnerables y bloquea la integración.

---

## Evidencia roja 05 — Gitleaks detecta secretos expuestos

Se incorporó intencionalmente un archivo de prueba con credenciales falsas con formato similar a claves AWS.

Resultado esperado:

```txt
Secret Scanning — Gitleaks
Secret detected
Process completed with exit code 1
```

Esta evidencia valida que el pipeline puede detectar secretos hardcodeados antes de que lleguen a producción.

---

# Métricas DevSecOps consideradas

El proyecto considera las siguientes métricas de evaluación:

| Métrica                      | Objetivo                       |
| ---------------------------- | ------------------------------ |
| Cobertura de pruebas         | Mayor o igual a 80%            |
| Vulnerabilidades críticas    | 0 en producción                |
| Secretos expuestos           | 0                              |
| Tiempo de detección          | Menor a 1 hora                 |
| Fallos de CI                 | Menor al 10%                   |
| Tiempo medio de recuperación | Menor a 30 minutos             |
| Frecuencia de despliegue     | Controlada por tags semánticos |

---

# Flujo de trabajo recomendado

## Desarrollo normal

```bash
git checkout develop
git pull origin develop
```

Realizar cambios, probar localmente y subir:

```bash
npm run lint
npm test
npm run build

git add .
git commit -m "feat: descripcion del cambio"
git push origin develop
```

---

## Crear Pull Request

Los cambios deben integrarse hacia `main` mediante Pull Request:

```txt
base: main
compare: develop
```

Antes de fusionar, deben pasar correctamente los workflows de CI y Security.

---

## Crear tag para CD

Una vez aprobado el cambio, se puede crear un tag semántico:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Esto activa el workflow de CD.

---

# Buenas prácticas aplicadas

* No subir archivos `.env`.
* No almacenar secretos en el código.
* Usar GitHub Secrets.
* Ejecutar pruebas antes de integrar cambios.
* Bloquear vulnerabilidades altas y críticas.
* Escanear contenedores antes del despliegue.
* Usar ramas separadas para evidencias rojas.
* No fusionar ramas de evidencia con errores intencionales.
* Mantener Dependabot activo.
* Aplicar revisión mediante Pull Request.

---

# Conclusión

Este proyecto demuestra la implementación de un flujo DevSecOps utilizando GitHub Actions. Se automatizaron controles de integración continua, análisis estático, pruebas unitarias, cobertura, análisis de dependencias, detección de secretos, escaneo de contenedores y despliegue controlado por ambientes.

Las evidencias rojas realizadas permiten comprobar que el pipeline bloquea errores de calidad, pruebas fallidas, dependencias vulnerables, secretos expuestos e imágenes inseguras, fortaleciendo la seguridad del ciclo de desarrollo.
