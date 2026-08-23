# CI/CD DevSecOps

Proyecto académico orientado a implementar un pipeline **CI/CD con enfoque DevSecOps**, integrando controles automáticos de calidad, testing, seguridad y despliegue mediante **GitHub Actions**.

El objetivo es aplicar seguridad durante todo el ciclo de desarrollo, evitando que código defectuoso, vulnerable o con secretos expuestos avance hacia producción.

---

## Tecnologías

* Node.js / Express
* Jest / Supertest
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

---

## Estructura

```text
CI-DI_DevSecOps/
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       ├── security.yml
│       └── cd.yml
├── src/
├── tests/
├── scripts/
├── Dockerfile
├── package.json
└── README.md
```

---

## Instalación

```bash
git clone https://github.com/ksmkk/CI-DI_DevSecOps.git
cd CI-DI_DevSecOps
git checkout develop
npm install
```

Ejecutar aplicación:

```bash
npm run dev
```

Pruebas:

```bash
npm test
```

Cobertura:

```bash
npm test -- --coverage
```

Análisis estático:

```bash
npm run lint
```

Build:

```bash
npm run build
```

---

# Pipeline DevSecOps

## CI — Integración Continua

Workflow:

```text
.github/workflows/ci.yml
```

Ejecuta automáticamente:

1. Instalación de dependencias.
2. ESLint.
3. Pruebas con Jest.
4. Validación de cobertura.
5. Build.
6. Generación de artefactos.

Si alguno de estos controles falla, el pipeline se detiene.

---

## Security

Workflow:

```text
.github/workflows/security.yml
```

Incluye:

* **CodeQL:** análisis estático de seguridad.
* **npm audit:** detección de dependencias vulnerables.
* **Gitleaks:** detección de secretos expuestos.
* **OWASP ZAP:** análisis dinámico de la aplicación.
* **Slack:** notificaciones ante fallos de seguridad.

---

## CD — Continuous Delivery

Workflow:

```text
.github/workflows/cd.yml
```

Se activa mediante tags semánticos:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Flujo:

```text
Docker Build
     ↓
Trivy Scan
     ↓
GitHub Container Registry
     ↓
Staging
     ↓
Production
```

El despliegue a producción puede requerir aprobación manual mediante **GitHub Environments**.

---

# Seguridad

El proyecto aplica controles de seguridad durante distintas etapas del pipeline.

| Control                   | Herramienta |
| ------------------------- | ----------- |
| Calidad de código         | ESLint      |
| Testing                   | Jest        |
| SAST                      | CodeQL      |
| Dependencias              | npm audit   |
| Secret Scanning           | Gitleaks    |
| DAST                      | OWASP ZAP   |
| Container Scanning        | Trivy       |
| Dependencias actualizadas | Dependabot  |

Los secretos se gestionan mediante **GitHub Secrets** y nunca deben almacenarse directamente en el repositorio.

---

# Evidencias rojas

Se utilizaron ramas específicas para comprobar que el pipeline bloquea errores intencionales:

```text
evidencia/ci-test-fail
evidencia/eslint-fail
evidencia/npm-audit-fail
evidencia/test-fail
```

Estas pruebas permiten demostrar que el pipeline puede bloquear:

* errores de código;
* pruebas fallidas;
* baja calidad;
* dependencias vulnerables;
* secretos expuestos;
* imágenes Docker vulnerables.

Las ramas de evidencia no deben fusionarse con `develop` ni `main`.

---

# Flujo de trabajo

```text
develop
   ↓
Pull Request
   ↓
CI + Security
   ↓
main
   ↓
Tag vX.X.X
   ↓
CD
   ↓
Staging
   ↓
Production
```

Antes de realizar un push:

```bash
npm run lint
npm test
npm run build
```

---

# Buenas prácticas

* No subir archivos `.env`.
* No almacenar tokens o contraseñas en el código.
* Utilizar GitHub Secrets.
* Mantener Dependabot activo.
* Integrar cambios mediante Pull Request.
* Escanear dependencias e imágenes antes del despliegue.
* Mantener las ramas de evidencia separadas.

---

## Conclusión

Este proyecto demuestra la implementación de un pipeline **DevSecOps automatizado**, incorporando calidad, testing y seguridad dentro del proceso CI/CD.

La combinación de **GitHub Actions, CodeQL, Gitleaks, npm audit, OWASP ZAP, Trivy y Docker** permite detectar problemas antes de que los cambios alcancen producción y demostrar mediante evidencias controladas que el pipeline bloquea condiciones inseguras.
