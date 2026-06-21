# Universo 404: Biblioteca Oculta

**Versión 1.1.0 — Edición ampliada para GitHub.**

PWA esotérica offline-first en HTML, CSS y JavaScript puro.

## Módulos incluidos

- Tarot: carta única, tirada de tres cartas, historial y exportación desde Archivo 404.
- Ouija simulada: tablero narrativo ficticio, sesiones guardadas, sin afirmaciones paranormales reales.
- Runas: Elder Futhark completo, una o tres runas, significados e historial.
- I Ching: lanzamiento de monedas virtuales, líneas mutables y comparación mediante historial.
- Diario de sueños: registros locales, calendario mensual, análisis de símbolos recurrentes y estadísticas.
- Calendario lunar: fase actual, calendario mensual, próximos eventos aproximados y correspondencias.
- Grimorio: hierbas, piedras, metales y planetas.
- Bestiario: criaturas de folclore como archivo cultural.
- Codex Symbolorum: biblioteca de símbolos.
- Cámara de Ecos: presets de audio ambiental generados con Web Audio, sin archivos externos.

## Privacidad

La app no envía datos a ningún servidor. Los sueños, sesiones y lecturas se guardan en `localStorage` del navegador.

## Cómo usar

Abre `index.html` directamente o súbelo a GitHub Pages. Para que la PWA offline funcione correctamente, úsala desde HTTPS, por ejemplo GitHub Pages.

## Estructura

```text
index.html
styles.css
app.js
manifest.webmanifest
sw.js
assets/icon.svg
```

## Nota legal y cultural

El contenido se presenta como herramienta simbólica, cultural, creativa y de entretenimiento. No sustituye consejo profesional ni afirma resultados sobrenaturales.


## Auditoría v1.0.1

- Endurecida la seguridad frente a inyección HTML en el diario de sueños.
- Añadida Content Security Policy.
- Mejorado el service worker con `skipWaiting`, `clients.claim` y cache versionada.
- Añadidos límites de entrada, aviso de privacidad y foco visible accesible.
- Añadidos `LICENSE`, `.gitignore` y `PRIVACY.md` para publicación en GitHub.

## Aviso

Las funciones esotéricas son simbólicas, culturales y narrativas. No sustituyen consejo profesional.

## Novedades v1.1.0

- Nuevo módulo Archivo 404 con historial visible.
- Exportación local en JSON y TXT.
- Presets sonoros: biblioteca antigua, lluvia, bosque nocturno, templo, mar, viento y cósmico.
- Calendario lunar mensual y eventos aproximados.
- Calendario de sueños, símbolos recurrentes y estadísticas.
- Grimorio, Bestiario y Codex ampliados.
