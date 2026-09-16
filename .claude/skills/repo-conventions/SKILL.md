---
name: repo-conventions
description: Detalles especificos de git/GitHub de este repo (CypressAutomation) que complementan al plugin git-flow generico: patron de rama, hooks de Husky/commitlint, y archivos que nunca deben subirse. Usar junto con git-flow al hacer commits, push o PRs en este repo.
---

# Convenciones especificas de CypressAutomation

Este repo instala el plugin generico `git-flow` (ver `AlexanderTincopa/claude-plugins`) para el flujo de commit/push/PR. Esta skill solo agrega el detalle que es propio de este proyecto y que `git-flow` no puede adivinar solo.

## Convencion de rama y commit (ya validada por hooks, no solo por convencion)

- Ramas: `usuario/descripcion-cambio`, ej. `atincopa/add-login-test`. Validado por `.husky/pre-commit` + `scripts/validate-branch-name.js`.
- Mensajes de commit: [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `ci`, `style`, `perf`). Validado por `.husky/commit-msg` + `commitlint.config.js`.

Estos hooks ya bloquean el commit si algo no cumple — no hace falta que la skill los repita, pero si un commit es rechazado, el fix es corregir el mensaje/rama, nunca usar `--no-verify`.

## Archivos que nunca deben ir en un commit

- `cypress/videos/`, `cypress/screenshots/`, `cypress/downloads/` (generados en cada corrida).
- `reports/cucumber-json/`, `reports/cucumber-html/` (generados por `npm run report:cucumber`).
- Cualquier `.env` o credencial (este repo no usa `.env`, así que su presencia es señal de algo fuera de lugar).

## Antes de un push

`.husky/pre-push` corre `npm run validate:steps` (detecta Step Definitions duplicados entre features de Cucumber). Si falla, el push se bloquea — corre `npm run validate:steps` localmente para ver el detalle antes de reintentar.

## Referencias

- Flujo de contribución completo: ver sección homónima en el [README](../../../README.md).
- Limitaciones del validador de Steps: ver `docs/prompt-validacion-steps-husky.md`.
