---
name: git-flow
description: Automatiza el flujo de git/GitHub de este repo (status, revision de cambios, commit, push y creacion de PR) siguiendo la convencion de ramas usuario/descripcion-cambio y Conventional Commits. Usar cuando el usuario pida "haz un commit", "sube estos cambios", "crea el PR", "revisa mis cambios antes de subir" o equivalentes.
---

# Git flow del equipo

Esta skill reemplaza al paso a paso manual descrito en el README (seccion "Flujo de contribucion" y "Hooks de nomenclatura"). Los hooks de Husky (`pre-commit`, `commit-msg`, `pre-push`) ya validan formato de rama y mensaje de commit — esta skill se encarga de la parte que un hook no puede evaluar: revisar el **contenido** del cambio antes de subirlo, y ejecutar los pasos en orden.

No asumas que el usuario quiere avanzar todo el flujo de una — confirma antes de cada accion que modifique estado remoto (push, PR). Nunca ejecutes merge sin que el usuario lo pida explicitamente: el merge depende siempre de un revisor humano.

## Pasos

1. **Diagnostico**: corre `git status` y `git diff` (staged y unstaged). Si hay archivos untracked que no deberian ir al commit (reportes generados, `node_modules`, `.env`, credenciales, videos/screenshots de Cypress), avisa antes de continuar.
2. **Revision de contenido**: lee el diff real, no solo los nombres de archivo. Señala si ves:
   - `console.log`, `.only`/`.skip` en specs de Cypress, codigo comentado sin razon.
   - Cambios mezclados que no tienen relacion entre si (deberian ir en commits/PRs separados).
   - Posibles secretos o tokens.
3. **Verifica la rama**: si la rama activa es `master`/`main`, o no sigue el patron `usuario/descripcion-cambio`, crea una rama nueva antes de commitear (`git switch -c usuario/descripcion-cambio` desde `master` actualizado). No dependas solo del hook `pre-commit` para esto — adelantate.
4. **Staging selectivo**: agrega archivos explicitos (`git add <archivos>`), nunca `git add -A`/`git add .` a ciegas. Confirma con el usuario qué se va a incluir si hay dudas.
5. **Mensaje de commit**: redacta el mensaje en formato Conventional Commits (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `ci`, `style`, `perf`) basado en el diff real, no en lo que el usuario dijo de forma informal. El hook `commit-msg` lo va a validar, pero preséntaselo al usuario antes de commitear.
6. **Commit**: ejecuta `git commit -m "tipo: descripcion"`. Si el hook lo rechaza, corrige el mensaje y reintenta — no uses `--no-verify`.
7. **Push**: `git push -u origin <rama>`. Pide confirmacion antes de este paso si no fue pedido explicitamente junto con el commit.
8. **Pull request**: usa `gh pr create --title "..." --body "..."` con un body que incluya `## Summary` (bullets del que) y `## Test plan` (como se probo). Apunta siempre a `master` salvo que el usuario indique otra base.
9. **Despues del merge** (cuando el usuario confirme que ya se mergeo, nunca antes): `git checkout master && git pull --ff-only && git branch -d <rama>`.

## Limites explicitos

- No hagas `git push --force` salvo pedido explicito.
- No hagas `gh pr merge` salvo pedido explicito del usuario.
- No uses `--no-verify` para saltarte los hooks; si un hook falla, el fix es corregir el commit, no saltarselo.
- Si `gh` no esta autenticado (`gh auth status` falla), avisa y pide al usuario correr `gh auth login` el mismo (es un flujo interactivo que no se puede automatizar).
