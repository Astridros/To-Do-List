# To-Do List con CI/CD (DevOps ITLA)

![Build Status](https://github.com/Astridros/To-Do-List-DevOps/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-En%20Desarrollo-blue)

## Descripción del Proyecto
Aplicación web interactiva que permite gestionar tareas pendientes (**To-Do List**), desarrollada con **HTML, CSS y JavaScript**.  
El proyecto implementa un **pipeline de CI/CD con GitHub Actions**, que ejecuta pruebas automatizadas con **Vitest** y despliega la aplicación en **GitHub Pages** de forma continua.

Este trabajo forma parte de la asignatura **Electiva DevOps** del Instituto Tecnológico de las Américas (ITLA).

## Características
- Agregar, editar, completar y eliminar tareas.
- Filtros: **pendientes**, **completadas**, **todas**.
- Persistencia con **LocalStorage**.
- Pruebas con **Vitest** (unitarias e integradas).
- CI/CD: build + test + deploy (GitHub Actions → GitHub Pages).

## Instalación Local
```bash
git clone https://github.com/Astridros/To-Do-List-DevOps.git
cd To-Do-List-DevOps
npm install
npm run test
```

## Pipeline CI/CD
Archivo: `.github/workflows/ci.yml`

**Etapas**
1) Build (Node 20 + `npm ci`)  
2) Test (`vitest run --coverage`)  
3) Deploy (GitHub Pages si los tests pasan)

**Triggers**: `push` a `main` y `pull_request` hacia `main`.

## Estructura
```
.github/workflows/ci.yml
js/ (script.js, utils.js)
tests/ (app.int.test.js, utils.test.js)
css/style.css
images/
index.html
README.md
```

## Tecnologías
HTML/CSS/JS · Vitest · GitHub Actions · Git/GitHub · GitHub Pages

## Contribución
# Guía de Contribución

Gracias por interesarte en contribuir al proyecto **To-Do List con CI/CD** 

## Flujo
1. Crea rama:
```bash
git checkout -b feat/nueva-funcionalidad
```
2. Haz cambios y **pasa pruebas**:
```bash
npm run test
```
3. Commits semánticos:
- `feat:` nueva funcionalidad
- `fix:` corrección
- `test:` pruebas
- `docs:` documentación
- `chore:` tareas de config

4. Abre un Pull Request describiendo claramente los cambios.

## Reglas
- No merges directos a `main` sin revisión.
- Cada feature debe traer sus pruebas.
- Mantén la estructura de carpetas y el estilo (2 espacios, camelCase).

## Despliegue (Pages)
Settings → Pages → Source: **main / root**.  
URL esperada: `https://astridros.github.io/To-Do-List-DevOps/`

## Pipeline (snippet)
```yaml
name: CI/CD Pipeline
on:
  push: { branches: [ main ] }
  pull_request: { branches: [ main ] }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run test:ci
      - name: Deploy a GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```
# Documentación del Pipeline CI/CD

El pipeline automatiza build, test y deploy con **GitHub Actions**.

## Disparadores
- `push` a `main`
- `pull_request` hacia `main`

## Etapas
1. **Build**: Node 20 + `npm ci`.
2. **Test**: `vitest run --coverage` (falla el pipeline si fallan tests).
3. **Deploy**: Publica a **GitHub Pages** con `peaceiris/actions-gh-pages` cuando las pruebas pasan.

# Instrucciones de Despliegue a GitHub Pages

1. En GitHub: **Settings → Pages**.
2. Source: **Branch = main**, **Folder = /(root)**.
3. Guarda y espera unos minutos.
4. Visita: `https://astridros.github.io/To-Do-List-DevOps/`
5. Revisa **Actions** para ver el pipeline y su estado.

## Problemas comunes
- La acción no se ejecuta: verifica que hiciste `push` a `main`.
- 404 en Pages: espera 2-5 minutos o vuelve a guardar la configuración.

##  Autor
**Astrid Rondon** — Estudiante de Desarrollo de Software (ITLA).

##  Licencia
MIT
