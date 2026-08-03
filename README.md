# MoonLit-Page

Página de presentación de **MoonLit**, el grabador de clips local-first para Windows x64 (basado en OBS Studio 32.2.1).

Web estática: HTML + CSS + JavaScript plano. Sin frameworks, sin build tools y sin dependencias.

## Estructura de carpetas

```
MoonLit-Page/
├── index.html              ← La página (todo el contenido está aquí)
├── assets/
│   ├── css/
│   │   ├── main.css        ← Colores, fuentes y estilos base
│   │   ├── components.css  ← Estilos de cada sección (navbar, hero, tarjetas...)
│   │   └── responsive.css  ← Ajustes para móvil y tablet
│   └── js/
│       ├── i18n.js         ← Cambia los textos según el idioma elegido
│       └── main.js         ← Botones "copiar" y menú activo
└── locales/
    ├── es.json             ← Todos los textos en español
    └── en.json             ← Todos los textos en inglés
```

## Cómo probar la página en tu máquina

La página necesita un pequeño servidor (no funciona abriendo el archivo directamente).

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000` en el navegador.

## Cómo cambiar un texto (3 pasos)

1. Abre `locales/es.json` (español) o `locales/en.json` (inglés).
2. Busca la frase que quieras cambiar. Cada frase tiene una clave, por ejemplo:

   ```json
   "hero.installer": "Descargar instalador",
   ```

3. Cambia solo el texto entre comillas y guarda. Recarga la página.

> Regla importante: nunca cambies la clave (lo que va antes de los dos puntos), solo el texto entre comillas.

## Cómo añadir una sección nueva

1. Copia el bloque de una sección parecida en `index.html` (por ejemplo, la de "Características").
2. Cambia el `id` del `<section>` y ponle un enlace nuevo en la barra de navegación apuntando a `#ese-id`.
3. Añade los textos nuevos en `es.json` y `en.json` con claves nuevas, por ejemplo `"nueva.texto": "..."`.
4. Usa `data-i18n="nueva.texto"` en el elemento HTML para que el texto se traduzca.

## Cómo publicar en GitHub Pages

1. Sube todo el proyecto a un repositorio en GitHub.
2. En el repositorio: **Settings → Pages**.
3. En **Source** elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
4. Guarda. La página quedará publicada en unos minutos en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO`.

Como todos los enlaces son relativos, la página funciona igual si algún día se usa un dominio propio.

## El selector de idioma

Los botones ES/EN guardan la elección en el navegador (localStorage). El texto por defecto del HTML está en español, por eso al cargar se ve en español antes de que el JavaScript aplique el idioma.
