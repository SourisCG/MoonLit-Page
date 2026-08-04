# MoonLit-Page

Página de presentación de **MoonLit**, el grabador de clips local-first para Windows x64 (basado en OBS Studio 32.2.1).

Web estática: HTML + CSS + JavaScript plano. Sin frameworks, sin build tools y sin dependencias.

Publicada en **https://moonlit.souriscg.dev** (GitHub Pages + dominio personalizado).

## Estructura de carpetas

```
MoonLit-Page/
├── index.html              ← La página (todo el contenido está aquí)
├── CNAME                   ← Dominio personalizado (moonlit.souriscg.dev)
├── assets/
│   ├── css/
│   │   ├── main.css        ← Colores, fuentes y estilos base
│   │   ├── components.css  ← Estilos de cada sección (navbar, hero, logo, tarjetas...)
│   │   └── responsive.css  ← Ajustes para móvil y tablet
│   ├── js/
│   │   ├── i18n.js         ← Idiomas: detecta el del navegador y aplica los textos
│   │   └── main.js         ← Botones "copiar", menú activo y tilt del logo
│   └── images/
│       ├── favicon.ico     ← Icono de la pestaña (6 tamaños, 16–256 px)
│       └── favicon.png     ← Icono en PNG (256 px, útil para la app)
├── scripts/
│   └── make_favicon.py     ← Regenera el favicon si cambia el logo
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

## El idioma

- Al cargar, la página **detecta automáticamente el idioma del navegador**: `es-*` muestra español e `en-*` inglés. Cualquier otro idioma cae en español.
- Los botones ES/EN del menú permiten elegir a mano y esa elección queda **guardada en el navegador** (localStorage): la próxima visita respeta lo elegido, sin importar el idioma del navegador.
- El texto por defecto del HTML está en español, por eso al cargar se ve en español antes de que el JavaScript aplique el idioma.

Para probar la detección: cambia el idioma del navegador a inglés (o borra los datos del sitio) y recarga.

## El logo

El logo es una **luna creciente con un triángulo de play**, dibujado con CSS puro (sin imágenes):

- La luna es un círculo con gradiente **rojo → azul** (`#ef4444` → `#3b82f6`) y un recorte circular (`mask` radial) que crea el hueco.
- El triángulo de play blanco está hecho con bordes CSS, dentro del hueco.
- Aparece en la **navbar** (28 px, junto al nombre) y en el **hero** (64 px, sobre el título, con resplandor pulsante y un efecto tilt 3D que sigue al ratón).
- Para cambiar los colores: busca el bloque `/* ============ LOGO (luna + play, rojo y azul) ============ */` en `assets/css/components.css` y edita los valores `#ef4444` y `#3b82f6`.

## El favicon

El icono de la pestaña (`assets/images/favicon.ico`) usa el mismo diseño del logo, en 6 tamaños (16, 32, 48, 64, 128 y 256 px) para verse nítido en cualquier resolución. Está enlazado en el `<head>` de `index.html`.

Se genera con Python (requiere Pillow):

```bash
pip install Pillow
python3 scripts/make_favicon.py
```

Si cambias el diseño del logo (o sus colores), edita las proporciones y los colores en `scripts/make_favicon.py` y vuelve a ejecutarlo: sobrescribe `favicon.ico` y `favicon.png`.

## Cómo publicar en GitHub Pages

1. Sube todo el proyecto a un repositorio en GitHub.
2. En el repositorio: **Settings → Pages**.
3. En **Source** elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
4. Guarda. La página quedará publicada en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO`.

### Dominio personalizado (moonlit.souriscg.dev)

El dominio ya está configurado, pero si algún día hay que rehacerlo:

1. El repo tiene un archivo `CNAME` en la raíz con el texto `moonlit.souriscg.dev`.
2. En el registrador de `souriscg.dev` hay que crear un registro DNS:

   | Tipo  | Nombre    | Valor                |
   |-------|-----------|----------------------|
   | CNAME | `moonlit` | `souriscg.github.io` |

3. En **Settings → Pages → Custom domain** escribe `moonlit.souriscg.dev` y guarda.
4. Cuando el DNS verifique, activa **Enforce HTTPS**.

Como todos los enlaces son relativos, la página funciona igual en el dominio propio que en `usuario.github.io/repo`.
