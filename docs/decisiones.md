# Decisiones de diseño por sección

Registro de lo aprobado en cada sección, para no repetir recursos y mantener el sistema coherente.

## Sistema (vale para toda la web)

- Paleta: azul de marca `#0080C1` (texto pequeño en `#0071AB`), tinta `#0B0D10`, hueso `#F4F2EE`, blanco. Nada de fondos oscuros.
- Tipografía: Instrument Sans (texto) + Instrument Serif itálica (una palabra o frase de acento en azul) + Architects Daughter solo para notas a mano.
- Forma: corte a 45° del monograma (`.chamfer`) en botones, tarjetas, muestras y esquinas del panel.
- Prohibido: puntos de "estado", etiquetas encima del título, cuadrículas o patrones de fondo, manchas con blur, recursos de plantilla.
- Textos: lenguaje del cliente que construye (lote, obra, maestro de obra, presupuesto), cortos y concretos. Enlaces de invitación con "Conoce".
- Rendimiento: animar solo transform/opacity; separar en capas lo que se anima de lo estático; nada de `filter: blur`.

## 1. Héroe "La lámina" (aprobado el 2026-10-30)

- **Recursos usados (no repetir como protagonistas):** boceto a mano de borde a borde con paisaje, lápiz que recorre el trazo, aguada de acuarela, escuadra, cajetín técnico, tablero de acabados interactivo (cambia la fachada), subrayado a lápiz en el título, nota manuscrita con flecha junto al botón.
- **Fondo:** hueso con azul tenue arriba a la izquierda, dentro de un panel con cortes a 45°.
- **Composición:** título y botones centrados; en celular el dibujo es una versión vertical propia y el tablero de acabados va debajo de los botones.
- **Interacción:** una sola escena; al salir con el scroll el texto se desvanece y el dibujo hace parallax. Tablero de acabados con mouse, toque y teclado.
- **Descartado:** la segunda escena con cuatro tarjetas del entregable en abanico (se veía plana); el entregable se cuenta en la sección 2.
- **Textos aprobados:** "Ve tu casa terminada / antes de construirla"; "Planos completos, renders y cantidades de obra para que tu casa se construya tal como la diseñamos."; botones "Cuéntanos de tu casa" y "Qué te entregamos"; "Conoce las obras que diseñamos en el Cesar".
- **Medición:** Lighthouse móvil 99 / 100 / 100 / 100, TBT 0 ms, CLS 0.

## Transición entre secciones · "Entrar por el logo" (componente `Portal.astro`)

- Entre secciones, el monograma se traza grande con el número y el nombre de la sección que viene (serif itálica azul + sans).
- Con el scroll, la cámara entra por el hueco blanco de la G (centro 512, 824; radio libre 210 en unidades del monograma). A través de ese hueco se ve la sección siguiente, que sube por detrás (`data-follows-portal` → margen negativo de 100svh).
- Zoom con el atributo `transform` del SVG (vector nítido en cada cuadro). Sin JS o con movimiento reducido: franja estática con logo y nombre.
- Reutilizable: `<Portal n="03" label="Qué diseñamos" />` + `data-follows-portal` en la sección siguiente.

## 2. "Lo que recibes" · Juego de láminas que se pasan (aprobado el 2026-10-30)

- Sección fija (220svh): con el scroll las láminas se doblan como papel real: la esquina inferior derecha se levanta, el pliegue diagonal avanza a la izquierda, el reverso del papel se refleja sobre el pliegue con su sombreado, y la hoja de abajo recibe sombra junto al pliegue (clip-path + gradientes calculados, sin 3D).
- Láminas: Planos (se trazan con cotas), Renders (render real de Ulises), Recorrido (cámara con cono de visión), Cantidades (zonas pintadas y etiquetas). Cada una anima su contenido al quedar a la vista.
- Selector: escalímetro a todo el ancho con marcador azul de corte a 45°; la línea de carga avanza con el scroll; clic lleva a la lámina.
- Ficha editorial a la derecha (nombre sans + serif itálica, frase, lo que incluye) y contador grande "01 / 04".
- Descartado: giro rígido en 3D (se veía como una pared).

## Conversión: un solo llamado a la acción (2026-10-30)

- Mismo texto en toda la web: **"Cotiza tu diseño"** (héroe, cabecera, menú, secciones). El botón de la cabecera queda siempre visible (decisión del usuario).
- Se quitó el botón secundario "Qué te entregamos" (el recorrido natural ya baja a esa sección).
- La obra pública pasa de enlace a línea de confianza fija bajo el botón: "Diseñamos colegios y obra pública construida en el Cesar".
- La nota a mano "cuéntanos de tu lote y lo hablamos por WhatsApp" se mantiene en escritorio: aclara el canal.
- Celular: sin tablero de acabados (la portada queda más limpia).
- Ojo técnico: nombres de @keyframes únicos por componente (prefijo hero-, en-, sk-): un nombre repetido pisa la animación de otra sección.
- Recursos ya usados (no repetir como protagonistas): sección fija con scroll, doblez de papel, escalímetro como selector, contador grande serif, ficha editorial con nombre en dos líneas.

## 3. "Qué diseñamos" · La mesa de maquetas (en revisión)

- Portal "03 · Qué diseñamos" entra a la sección (mismo recurso del logo).
- Título "¿Qué vas a construir?". Cuatro casos en palabras del cliente: Casa campestre, Casa urbana, Remodelación y ampliación, Diseño de interiores. Comercial en franja secundaria abajo.
- Cada caso: maqueta axonométrica blanca en SVG (generada al compilar, `lib/iso.ts`), que se arma pieza por pieza al entrar en pantalla y se abre en vista explotada por niveles al pasar el mouse. En remodelación, lo existente en gris punteado y lo nuevo en azul de marca.
- Toda la tarjeta abre el chat con el servicio elegido (`data-service`).
- Fondo hueso (alterna con el blanco de la sección 2).
- Ojo técnico: las clases de estado que se agregan desde otro componente (is-built, is-exploded) van dentro de `:global(...)`; Astro aísla los estilos por componente.
- Cambio: de cuatro tarjetas a "la mesa de maquetas": las cuatro maquetas juntas sobre una sola mesa (tablero + canto), con ficha de cartón; la elegida se levanta, se abre y las demás se atenúan; descripción del caso debajo y un solo botón "Cotiza tu diseño" que lleva el caso al chat. Celular: la mesa se desliza de lado. Comercial como línea de texto, no botón.

## Hilo entre secciones · La plomada (componente `Plomada.astro`)

- Dentro de cada sección, arriba y centrada: un hilo azul baja desde la cabecera y del hilo cuelga el monograma como plomada. Al entrar la sección cae y se mece hasta quedar a plomo; el scroll rápido la vuelve a mecer. Debajo, número en serif itálica y nombre. Uso: `<Plomada n="04" label="..." />` como primer elemento de la sección.
- Regla (del usuario): **cada sección, con su marca, cabe completa en una pantalla**. Nada de bloques separadores que alarguen la página. Verificar siempre con el script de ajuste en 390, 375×667, 430, 768, 1100, 1280 y 1440.
- Descartados: portal a pantalla completa, marca pequeña a la izquierda, hilo como bloque aparte. Todos en `archive/`.

## Sección 3 · Experiencia
- Sin decorado suelto (la lámpara se quitó: estaba fuera de contexto).
- Figuras humanas a escala en las maquetas; la mesa se recorre sola cada 4 s (barra de avance en la ficha) hasta que la persona interactúa; línea "Ideal si…" por caso para que el cliente se reconozca.

## Sistema de fondo · Simbología de lámina (componente `Trazos.astro`)

- En las esquinas superiores de cada sección, a lado y lado de la plomada: símbolos de plano en línea fina y tenue que se trazan al entrar. Repertorio: norte, escala gráfica, cota de nivel (▽ N +0,45), marca de corte A–A'. Fondo opcional: curvas de nivel del terreno, desvanecidas hacia los bordes (máscara radial) para no cruzar los textos.
- Usados: sección 2 = norte + escala; sección 3 = nivel + corte + curvas de nivel. Para 4–8: combinar sin repetir el par exacto (p. ej. ejes A/B, cotas, rosa de vientos, detalle de muro).
- Nunca como patrón repetido ni cuadrícula: pocos símbolos, cada uno en su lugar.

## 4. "Obras construidas" · Del dibujo a la obra (en revisión)

- Título "Lo que dibujamos *se construye*" + "Siete proyectos con la Gobernación del Cesar: cuatro construidos y dos en obra." Retoma la promesa del héroe (ver la casa antes de construirla) con prueba real.
- Lámina con corte a 45°: cada obra entra como dibujo a tinta y una **línea de obra** azul la recorre de izquierda a derecha; lo que queda atrás ya es la foto real. Se detiene al 80 % dejando una franja de dibujo y la perilla a la vista; se puede arrastrar (mouse, dedo en horizontal, teclado con flechas). Etiquetas pegadas a la línea: "obra" (o "render" si aún no existe) y "dibujo".
- Los dibujos salen de las fotos del portafolio (XDoG + limpieza de manchas por componentes conectados; script en el scratchpad `lineart2.py`, con scipy en un venv). Archivos en `src/assets/obras/ln/` (foto + `-linea`).
- Escritorio: al lado, el **cuadro de obras** (como el cuadro de áreas de un plano): número, obra, año y estado; la fila elegida se subraya en azul. Pasar el mouse o hacer clic cambia la obra. Celular y tableta: ficha + flechas, sin cuadro.
- Recorrido solo: cada obra se construye y a los 4,2 s pasa a la siguiente hasta que la persona toca algo. Solo corre con la sección en pantalla.
- Estados honestos: Construido (azul lleno), En construcción (azul tenue), Diseñado (gris). Coliseo y Río de Oro llevan "render".
- Un solo botón "Cotiza tu diseño" (`data-cta="obras"`) + "El mismo rigor de una obra pública, para tu casa."
- Fondo blanco (la 3 es hueso). Trazos: ejes A/B + línea de cota (nuevos en `Trazos.astro`; las líneas punteadas van con clase `ax`, sin `pathLength`).
- Ojo técnico: corte del dibujo solo con transform (marco y contenido se corren en sentidos opuestos), nada de clip-path animado. Sin JS se ve la foto con la franja de dibujo. Atributos propios `data-ob-*` para no chocar con `data-stage`/`data-row` de otras secciones.
- Medición: Lighthouse móvil 99 / 100 / 100 / 100, TBT 0 ms, CLS 0. Cabe en 390, 375×667, 430, 768, 1100, 1280 y 1440.
- Recursos usados (no repetir como protagonistas): comparador por línea arrastrable, dibujo a línea sacado de foto, cuadro tipo tabla técnica.

## Corrección mobile (2026-10-30) · regla nueva
- **Mobile se revisa primero y completo**, con los altos reales de Safari (iPhone 13 = 390×664, SE = 375×667, Pro Max = 430×739, Galaxy 320×658, Pixel 412×839, iPad Mini 768×1024), recorriendo la página con scroll gradual y probando gestos táctiles reales (CDP). Las capturas a 390×844 no sirven: el alto útil real es ~664.
- Nunca esconder textos para que quepa: se aplana el dibujo o la lámina según el alto.
- Nada de filas que se deslizan de lado con elementos cortados en el borde.
- Sección 3 en celular y tableta vertical: mesa 2 × 2 con las cuatro maquetas a la vista (sin deslizar), nombre corto en la ficha ("Campestre", "Urbana", "Remodelación", "Interiores"), bajada "Vivienda de principio a fin. Toca tu caso.", recorrido automático también en celular. Versión anterior en `archive/Servicios-mesa-deslizable.astro`.
- Bug encontrado: la clase `.table` chocaba con la utilidad `table` de Tailwind (display: table) y montaba la mesa sobre el texto. **No usar nombres de clase que sean utilidades de Tailwind** (table, flex, grid, hidden, block, container…). Se renombró a `.mesa`.
- Cabecera: si el nombre de la sección no cabe entero en la cápsula (320 px), no se muestra cortado.
- Sección 4: la línea solo se mueve con gesto horizontal claro; tocar o deslizar en vertical hace scroll normal.

## 4 v2 · "En pantalla grande" (2026-10-30, en revisión)
- Se conserva la idea ganadora (dibujo → obra con la línea). v1 en `archive/Obras-v1-cuadro.astro`.
- Pantalla protagonista (de borde a borde en celular, alto calculado con el alto real de pantalla), acercamiento lento de cine en foto y dibujo a la vez (siguen alineados), línea blanca con resplandor azul y haz de luz que barre el dibujo mientras se construye.
- Ficha sobre la imagen con degradado oscuro abajo: número, ciudad · año, nombre grande, estado, m² (y descripción en pantallas altas).
- Ritmo: 0,22 s de entrada + 1,5 s de barrido + 3 s de pausa por obra (≈4,7 s); acercamiento de 7 s; cambio de obra en 0,45 s.
- Selector: tira de obras con miniatura y barra de avance (tipo historias). Celular: 7 miniaturas a la vista en una fila (nada se desliza). Escritorio: lista a la derecha con miniatura, nombre, año y estado; botón debajo.
- Esquinas a 45° hechas con triángulos sólidos, no con clip-path (en Chrome las capas animadas se escapaban del recorte: triángulo oscuro).
- Medición: Lighthouse móvil 98 / 100 / 100 / 100, TBT 0, CLS 0. Cabe en SE, 13, 15 Pro Max, Pixel 7, Galaxy 320, iPad Mini y 1100/1280/1440.

## Héroe · La lámina que se vuelve render (2026-10-30, en revisión)
- La casa recortada pegada sobre el boceto se veía "fea y montada". Ahora la escena completa es un render de arquitecto aportado por el usuario (`src/assets/escena/fuente.webp`, 2752 × 1536): volumen en madera en voladizo sobre concreto a la vista, vidrio, abedules y pastos.
- El boceto se trazó sobre ese render (`escena.py` en el scratchpad → `src/lib/escena.json`; `src/lib/escena.ts` le da pulso y tiempos): aristas medidas de la arquitectura, listones y juntas en perspectiva, abedules, arbolito, pastos y gravilla dibujados a mano en sus posiciones reales.
- Secuencia (`Escena.astro`): lápiz (0,3–3,3 s) → acuarela de la escena (2,5 s) → el render aparece encima (3,7 s, fundido de 2,8 s, curva seno) y las líneas se retiran debajo; notas a mano con halo blanco. El cielo del render se funde con el papel (alfa solo en el cielo, de 0 arriba a 1 a media altura), sin bordes.
- Encuadre por JS: la casa se ve **completa** (techo bajo "Diseños ya construidos", piso de la casa sobre el borde inferior; en celular, sobre la placa de Ulises). Si la foto queda más angosta que el panel, se centra y sus bordes se disuelven en el papel (fundido lateral amplio del 22 % del ancho, curva suave; el rectángulo duro se veía "chambón"); si queda más ancha, se recorta a los lados centrada en la casa (celular: máximo 1,3 veces el ancho). El bloque de texto de escritorio subió (top: cabecera + clamp(6px, 2,4svh, 34px)). La lámina se muestra solo ya ubicada (evita CLS).
- Tablero de acabados: parches precalculados sobre las dos caras del volumen (perspectiva con homografía, luz y sombras de los árboles del propio render, árboles enmascarados): concreto, piedra, vidrio; madera = el render.
- Sin escuadra (sobre la foto se veía pegada). Nombre de Ulises sobre una placa de papel.
- Medición: Lighthouse móvil 98 / 100 / 100 / 100, CLS 0, LCP 2,2 s; render 155 KB (celular) / 399 KB (escritorio), se pide al arrancar el dibujo.
- Pendiente: confirmar autoría y permiso de uso del render.
- Archivos anteriores: `archive/Sketch-casa.astro`, `archive/sketch-casa-3d.ts`.

## Héroe · Render a pantalla completa (2026-10-30, en revisión)
- La foto con bordes difuminados flotando en el papel se veía "chambona". Ahora: el dibujo se hace sobre el papel y, al terminar, **el render cubre todo el héroe de borde a borde**; entra un filtro oscuro suave (más denso arriba y abajo, la casa queda viva) y los textos, la cabecera y el tablero pasan a blanco / azul claro. Mismo fundido de 2,8–3,4 s; los textos cambian con 1,45 s de retraso.
- Para que la foto cubra el alto sin tapar la casa con el texto, se extendió el cielo de la foto hacia arriba (`cielo.py`: degradado de bruma al azul del cielo real + ruido suave): 1700 px en escritorio, 3000 px en celular. Imágenes `escena-full-wide/tall.webp`.
- Encuadre: escritorio, la foto cubre el ancho y la casa se apoya abajo (base del vidrio en el borde); celular, 1,12 veces el ancho, casa completa abajo y el texto sobre el cielo. El filtro vive dentro de la escena (debajo del tablero) y sigue la geometría de la foto (`--p`).
- Notas a mano se retiran al aparecer la foto. Sombra suave en los textos sobre la foto.
- Medición: Lighthouse móvil 98 / 100 / 100 / 100, CLS 0, LCP 2,2 s; animación fluida con CPU ×4.
- Versiones anteriores: `archive/Hero-escena-centrada.astro`, `archive/Escena-centrada.astro`.

## Héroe · Se vuelve al aprobado (2026-10-30)
- Decisión del usuario: queda el primer héroe aprobado (boceto a lápiz de la casa campestre, acuarela y tablero de acabados dibujado). Se descartan las pruebas de render (interior de Ulises, casa pintada en SVG, render recortado y render a pantalla completa). Todo quedó en `archive/hero-render-interior/` y `archive/hero-render-escena/`.
- Se mantienen dos cambios pedidos en el camino: sin figuras humanas y sin los dos árboles que quedaban detrás de la casa.
- Aprendizaje: en el héroe, no mezclar foto real con el boceto sin un render propio del proyecto hecho a la medida; los recortes y fundidos se ven "montados".
- Sección 4 · perilla de la línea (pedido del usuario: "se ve básica"): el monograma de Galezo en su bloque azul con corte a 45° y filo interior, flechas a los lados que se asoman mientras nadie la toca; la línea lleva marcas de escalímetro (cada 14 px, mayores cada 70 px). Al barrer, el monograma gira un cuarto de vuelta; al arrastrar, el bloque se ilumina.

## 5. "Cómo trabajamos" · La casa que evoluciona (en revisión)
- Título "Tu casa, *etapa por etapa*"; bajada: anticipo + etapas que se revisan y aprueban. Pasos (borrador, sin tiempos ni precios, por confirmar con Ulises): Tu espacio (anticipo) · La idea · El plano · La fachada · Para construir (entrega).
- Lámina única (`Proceso.astro` + `lib/proceso.ts`): la misma casa del héroe en cada etapa — lote con curvas de nivel, mojones, vía y acceso → diagrama de burbujas con brisa y sol → plano de distribución (de `lib/plan.ts`) que se traza sobre las burbujas → fachada en color con notas y el render real de Ulises sujeto con cinta → plano con cotas, áreas achuradas y cuadro de cantidades (barras, sin cifras).
- Cronograma tipo Gantt a la derecha (escritorio): cada etapa es una barra escalonada que se llena; las terminadas quedan con ✓; "Anticipo" y "Entrega" escritos a mano. Celular: cronograma en una línea de cinco tramos para dejar grande la lámina. **Avanza con el scroll** (pedido del usuario): la sección mide 300svh y la lámina queda fija; el recorrido se reparte en cinco tramos y la barra de la etapa activa se llena al ritmo del scroll. Tocar una etapa lleva el scroll a ella; teclado con flechas. Sin JS o con movimiento reducido, sección normal.
- Fondo hueso (la 4 es blanca). Trazos nuevos: rosa de vientos + detalle de muro.
- Medición: cabe en SE, 13, 15 Pro Max, Galaxy 320, iPad Mini, 1280 y 1440; Lighthouse móvil 98 / 100 / 100 / 100.
- Fluidez (reporte del usuario: 03 y 05 se trababan y titilaban en celular): cada etapa es ahora un `<svg>` propio en capa compuesta (`will-change: opacity, transform`); los cambios solo animan opacidad y transform. El plano ya no se traza línea a línea (eran cientos de trazos con `stroke-dashoffset`): entra completo con un leve asentamiento. Histéresis de 0,06 etapas para no saltar entre dos etapas al frenar en el límite. El recorrido se calcula con el alto de la lámina fija, no con `innerHeight` (en iOS cambia con la barra de Safari). Medido: recorrido completo de la página en Pixel 7 con CPU ×4, 0 cuadros largos en todas las secciones.
- Regla para todo el sitio: nada de `stroke-dashoffset` sobre trazados con cientos de segmentos durante el scroll; dibujar por capas y animar solo opacidad/transform.

## Marcas de sección distintas (pedido del usuario, 2026-10-31)
- Todas bajan desde la cabecera, llevan el monograma y miden lo mismo (`Plomada.astro`, prop `variant`); cada una cuenta su sección:
  - 02 plomada (aprobada, sin cambios): el monograma cuelga del hilo y se mece.
  - 03 maqueta: el monograma se arma por capas (extrusión) que se apilan hasta formar el bloque; sombra sobre la mesa.
  - 04 obra: el monograma aparece en contorno (dibujo) y una línea con luz lo cruza dejándolo sólido (construido).
  - 05 sello: el sello cae, golpea (se aplasta), sube y se desvanece; queda la huella con su onda: "aprobado".
- Solo la plomada (02) cuelga del hilo (pedido del usuario: "no todos colgados").
- Versión anterior: `archive/Plomada-v1.astro`.

## 6. "Quién diseña" · Su carrera en corte (en revisión)
- Título "Quién está detrás de *tu diseño*". Marca de sección: monograma + rasgo de firma que se traza (variante `firma`). Trazos: puerta + escalera ("sube"). Fondo blanco (la 5 es hueso).
- (Cambio pedido por el usuario: los empleadores y fechas se leían como hoja de vida privada.) Ahora el corte cuenta **lo que respalda el diseño**, sin empresas ni fechas, con cotas de nivel en vez de años: Cimientos · Arquitecto, U. del Atlántico; N +3,00 · 6 años de experiencia; N +6,00 · Vivienda urbana y campestre; N +9,00 · Obra pública construida; N +12,00 · Planos que se construyen; Cubierta · Tu casa, diseñada y firmada por Ulises. Versión anterior descrita abajo.
- (Anterior) La trayectoria de Ulises (portafolio, p. 5) dibujada como el corte de un edificio que se construye piso por piso al entrar: cimientos = Universidad del Atlántico 2015–2020; pisos = Independiente 2020–hoy, Constructol SAS 2020–2021, Gobernación del Cesar 2021–hoy, Vive Ámbar 2023 (condominios urbanos y campestres); cubierta = Galezo Studio, hoy (con el logo y alero). Muros y losas cortados en negro, vanos de ventana, escalera en corte y terreno achurado. HTML (no SVG) para que el texto se lea a cualquier tamaño.
- Perfil: foto (pendiente una mejor), nombre, formación, 6 años; escritorio suma su frase (adaptada del portafolio, por confirmar) con su nombre escrito a mano y sus herramientas (Revit, AutoCAD, SketchUp, D5, Lumion). Botón "Cotiza tu diseño" + "Hablas directo con quien diseña tu casa."
- Celular: corte arriba con año + nombre por piso en una línea; perfil debajo.
- Sección 2 · bloque azul (reporte del usuario: tocaba el texto de la ficha en escritorio): ya no es un % del ancho; por JS termina en la mitad exacta del espacio entre la lámina y la ficha (simétrico, nunca toca el texto). Verificado de 1024 a 2560 px.

## 7. "Preguntas" · El chat con Ulises (en revisión)
- Título "Pregúntale *a Ulises*". Marca: globo de mensaje que escribe (tres puntos) y responde con el monograma (variante `chat`). Trazos: ventana + llamada de detalle. Fondo hueso.
- Chat de marca (azul, sin verde ni "en línea"): encabezado con foto de Ulises y "responde por WhatsApp"; el cliente toca una pregunta, aparece su mensaje, Ulises "escribe" y responde. Si nadie toca, responde la primera como ejemplo. Los mensajes se apilan desde abajo y los viejos se desvanecen en una máscara (sin scroll interno que atrape el dedo).
- Solo respuestas confirmadas: precio (se cotiza por WhatsApp), pago (anticipo + etapas), no construimos, todo Colombia, qué recibes, locales. Todas las preguntas y respuestas están además en una lista oculta en el HTML (lectores y buscadores; base para el JSON-LD FAQPage de la fase SEO).
- Ojo técnico: los mensajes creados por JS no llevan el atributo de alcance de Astro → sus estilos van con `:global(.msg…)`.
- Sección 6 en celular (revisión del usuario): sin escalera (chocaba con el logo y los muros), cada piso con su descripción en segunda línea, corte más alto y el perfil sin repetir lo del corte (solo nombre y cargo).
- Sección 7 · voz del estudio (el usuario: "Ulises es el arquitecto pero hay un equipo detrás"): título "Pregúntanos *lo que quieras*"; el chat es de "Galezo Studio · Ulises y su equipo", avatar con el monograma; respuestas en plural. Sección 6 ajustada: "Lidera el diseño de cada casa, junto a su equipo" y "Hablas directo con el equipo que diseña tu casa".
- Chat en celular: preguntas en una fila que se desliza de lado (con difuminado a la derecha); la conversación usa `column-reverse` para que el mensaje nuevo nunca se corte y lo viejo salga por arriba.

## 8. Cierre y pie de página · "El último trazo" (en revisión)
- El sitio termina como una lámina: con el cajetín. Marca de sección: el monograma se traza a lápiz y se llena (variante `trazo`).
- "¿Empezamos *tu casa*?" + "Cuéntanos de tu espacio y te enviamos la cotización por WhatsApp." + botón.
- La hoja se dibuja contigo: en escritorio el puntero es un lápiz (cursor propio) y deja trazos de grafito en un `<canvas>` que se desvanecen en 2,6 s (más rápido = más fino); no dibuja sobre botones ni cajetín; pista a mano "pasa el lápiz por la hoja". En celular (sin puntero fino) un lápiz dibuja solo una fachada tenue de fondo, en bucle mientras la sección está a la vista (no interfiere con el scroll).
- "Galezo Studio" a todo el ancho en contorno que se llena de tinta al ritmo del scroll (Galezo en tinta, Studio en azul).
- Cajetín = pie: marca, contacto (WhatsApp con `data-open-chat`, correo, Instagram), Valledupar + todo Colombia, índice de secciones numerado, Lámina 08/08 · Escala 1:1 · año, legal + "Volver al inicio".

## Cierre v2 · Bloque azul de marca + navegación (2026-10-31)
- Pedido: el pie "puede ser mucho más power". Elegido: bloque azul de marca (degradado del azul, cortes a 45°, como el panel del héroe) que ocupa toda la pantalla final. Textos y marca de sección en blanco; acento azul claro #bfe6fb; botón blanco.
- Monograma gigante en contorno al fondo que se traza con el scroll; lápiz con trazos blancos (cursor de lápiz blanco en escritorio); "Galezo Studio" se llena de tinta con el scroll y su contorno se desvanece al llenarse (antes se veían marcas donde se cruzan las letras). En escritorio la marca va abajo, a todo el ancho (medida por JS), cortada por el borde como un sello; en celular va entera sobre el cajetín y el cajetín omite la fila de marca.
- Cajetín en líneas blancas sobre el azul. Versión anterior: `archive/Cierre-v1-blanco.astro`.
- Navegación: la cabecera solo lleva "Servicios" (por ahora → /#servicios; cada servicio tendrá su página) y "Blog" (/blog: página "Próximamente" con noindex, título "Estamos escribiendo para ti", botón al chat y el mismo cierre). `Base.astro` acepta `noindex`.
- Cierre v3 (referencia del usuario: pie de emprenlace.com): ya no ocupa la pantalla; es una tarjeta azul con margen blanco alrededor y alto según su contenido (se lee como el final de la página). Elementos más pequeños (título 1,9–3,4 rem, botón 48 px), sin índice; cajetín de 4 celdas; la marca al pie se limita a 820 px en escritorio y queda cortada por el borde.
- Cierre · entradas en cadena: la tarjeta sube; el título sube línea por línea desde su máscara; bajada y botón (con rebote) después; el marco del cajetín se traza por sus cuatro lados y las celdas aparecen una por una; 'Galezo Studio' sube desde el borde palabra por palabra. Con movimiento reducido o sin JS todo queda visible.
- Cierre · tinta: el avance se mide hasta el final del scroll (en el último píxel vale 1); antes 'Studio' quedaba a medio llenar porque el pie es lo último de la página.
- Cierre · tinta v2: el relleno empieza cuando la marca asoma y termina en el último píxel (recorrido mínimo de 420 px o 45 % de la pantalla para que se note en escritorio); Galezo en el primer 65 %, Studio del 35 % al final; contorno más visible antes de la tinta. Al devolver el scroll se vacía.
- Cierre · la marca al pie ya no queda cortada por el borde (al usuario le parecía incompleta): se ve entera con aire debajo.
- Cierre · relleno: la última letra se salía de la caja del texto y quedaba sin tinta; cada palabra lleva padding con margen negativo para que el relleno la cubra entera. La marca sigue cortada por el borde (decisión del usuario).

## Navegación · Desplegable de servicios (2026-10-31)
- "Servicios" lleva flecha y despliega los cinco servicios (`src/lib/servicios.ts`, fuente única para menú, páginas y `data-service`): Casa campestre, Casa urbana, Remodelación y ampliación, Diseño de interiores, Locales comerciales. Escritorio: panel con corte a 45° (número en serif, nombre y una línea), se abre al pasar el mouse o con clic/teclado, Esc cierra, "puente" invisible para no cerrarse al bajar el mouse; "Ver todos en la página" → /#servicios. Celular: dentro de la hoja del menú, "Servicios" se despliega como acordeón.
- Páginas `/servicios/[slug]` creadas como portada provisional (noindex, "En construcción", botón al chat con su servicio y el mismo cierre). Se diseñarán una a una.
- Desplegable v2 ("más horizontal, más UX/UI, se ve plano"): mega panel horizontal centrado en la cabecera (hasta 1120 px): columna de introducción "Qué diseñamos" + 5 tarjetas con la maqueta axonométrica de cada servicio (se arma al abrir; al pasar, la tarjeta se ilumina, la maqueta sube y se abre por niveles y aparece la flecha). Nueva maqueta `comercial()` en lib/iso.ts. Ojo: `.hd-nav ul` era flex y pisaba el grid de las tarjetas.
- Cierre · fluidez del relleno (reporte: en celular no era fluido): ya no se anima background-position en letras gigantes (repintaba todo el texto en cada cuadro). Ahora el contorno queda quieto y una copia llena se descubre con dos transform opuestos en capas compuestas; el contorno solo cambia de opacidad. El monograma del fondo se traza una sola vez al entrar (antes seguía al scroll con stroke-dashoffset). Medido con CPU ×4: 0 cuadros largos en celular y escritorio, ida y vuelta; relleno 100 % al final en SE, 13, 320 px, iPad Mini, 1280, 1440 y 1920.
- Cierre en celular: sin lápiz automático (redibujaba el lienzo en cada cuadro y competía con el scroll en Safari de iPhone); el lienzo no se crea en pantallas táctiles. El lápiz con el mouse sigue en escritorio.
- Cierre · recarga en el pie (reporte: el relleno quedaba cortado): el navegador restaura el scroll por pasos sin un evento fiable; ahora el relleno se recalcula cada cuadro durante 2,5 s tras cargar (y 1,5 s tras load/pageshow), además de en scroll, resize, letra lista, cambio de alto de la página y ajuste de la marca. Probado recargando 3 veces al fondo en WebKit (iPhone 13, 1440) y Chromium (Pixel 7, 1440): 100 %.

## Fase 4–5 · SEO técnico, medición y chat calificador (2026-10-31)
- Limpieza: recursos de las pruebas del héroe, `scripts/maqueta.ts` y `Plan.astro` a `archive/sin-uso/`; fuera Three.js y paquetes de letras sin uso.
- SEO: Open Graph/Twitter con imagen propia 1200×630 (`public/og/galezo-proyecto.jpg`, `PUBLIC_URL` para el dominio de hoy), canonical solo en indexables, `noindex` + `PUBLIC_PREVIEW`, JSON-LD `ProfessionalService` + `WebSite` + `FAQPage` (preguntas en `lib/faq.ts`, compartidas con la sección 7), `robots.txt`, `sitemap-index.xml` → `sitemap-paginas.xml` (solo indexables), 404 real ("Este plano no existe").
- Chat calificador (`Chat.astro`, `lib/lead.ts`, `lib/track.ts`): ver `docs/medicion.md`. Pruebas `npm test` (filtro, prioridad, mensaje, privacidad).
- Consent Mode v2 + aviso de cookies.
- Medición: Lighthouse móvil 98 / 100 / 100 / 100 (una corrida dio 94 por variación; la siguiente 98, TBT 0).
- Cambio (2026-10-31): sin aviso de cookies (público en Colombia; consentimiento concedido por defecto). El chat calificador se reemplazó por el **cotizador** (formulario de una pregunta por pantalla, compromiso progresivo, maqueta que se arma como recompensa, contacto al final: nombre + WhatsApp + correo obligatorios). Todo envío se guarda en Google Sheets; solo el que encaja es conversión; ambos abren WhatsApp. Lead parcial al cerrar con contacto válido. Política de privacidad en `/privacidad` (borrador, enlazada en el pie y en el formulario). Chat anterior en `archive/sin-uso/Chat-calificador.astro`. Probado de punta a punta con una base de prueba: completo A, parcial B, sin datos personales en el dataLayer; 12 pruebas automáticas.
- Base de datos conectada (2026-10-31): PUBLIC_LEADS_URL en .env apunta al Apps Script de la hoja "Galezo Studio · Leads". Probado: envío directo (GZ-PRUEB-1, ok) y desde el formulario real (GZ-CUH75-3, POST enviado). Recordar: el .env debe ir también al servidor de producción.

## 2026-10-31 · Atribución ampliada
- Se agregan utm_content y utm_term (primer y último toque), ttclid (TikTok) y fbp/fbc (Meta) a la hoja y al dataLayer.
- Columnas nuevas van al final para no mover las filas existentes; el script reescribe la fila de encabezados si faltan columnas.
- fbp/fbc sirven para subir conversiones a Meta (API de Conversiones) con mejor coincidencia.

## 2026-10-31 · Envío del lead y pestaña de WhatsApp
- El lead se envía con `fetch` + `keepalive` (texto plano, no-cors). `sendBeacon` queda de respaldo: los bloqueadores lo frenan y Safari lo mandaba sin cuerpo.
- WhatsApp se abre con `window.open(link, '_blank')` y luego `w.opener = null`. Con `'noopener'` en las opciones, window.open devuelve null y el respaldo `location.href` sacaba la web hacia WhatsApp.
- 404 "Aquí todavía no hemos construido nada": maqueta 4·0·4, el cero se construye al tocar el lote (evento `not_found_build`).

## 2026-10-31 · Clientes en Obras
- Logos de Gobernación del Cesar y Alcaldía de Valledupar (INDER) recortados a PNG transparente (src/assets/clientes). Se quitó solo el blanco conectado al borde; los blancos internos de los escudos se conservan.
- Van en color. Celular: junto al botón "Cotiza tu diseño", en lugar de la nota (no suman alto a la sección de una pantalla). Tableta y escritorio: bajo el subtítulo.
- Subtítulo pasa de "proyectos con la Gobernación del Cesar" a "proyectos de obra pública en el Cesar", porque ya son dos entidades.

## 2026-10-31 · De "casa" a "proyecto" y nuevo servicio
- El estudio recibe proyectos de todo tipo: los textos hablan de "tu proyecto" en vez de "tu casa". Se quedan los nombres de servicio "Casa campestre" y "Casa urbana" (es lo que busca la gente) y el dato de experiencia "Casas y condominios".
- Nuevo servicio: "Obra pública e institucional" (colegios, escenarios deportivos, edificios públicos). Menú (6 maquetas, la nueva es un colegio en claustro), página /servicios/obra-publica-e-institucional, cotizador (etapas: lote, ya construido, averiguando; obra nueva <60 m² no encaja) y SEO.
- La sección 3 (mesa de maquetas) sigue con los 4 casos de vivienda; su subtítulo ahora dice "de la vivienda a la obra pública".
- Hero en celulares bajitos (iPhone SE): el título de tres líneas baja a 1,72rem y el bloque se alinea arriba.

## 2026-10-31 · Ajustes después de presentar la web
- Se quita el proyecto I.E. Alfonso López Pumarejo (Río de Oro); sus imágenes pasan a archive/obras. Quedan 6 proyectos.
- Sección 04 pasa a llamarse "Proyectos".
- Dibujos de las obras rehechos como boceto a lápiz (docs/lapiz.py): la foto se simplifica con medianas para quitar texturas, las aristas fuertes se dibujan como línea de grafito y las sombras con achurado sobre papel. Archivos *-boceto.jpg (nombre nuevo para que el navegador no use los viejos). Requiere numpy, scipy y pillow.
- Sección 03: "También diseñamos" deja de ser una línea suelta; ahora son dos tarjetas con maqueta (locales comerciales y obra pública e institucional) que enlazan a sus páginas.
- Sección 06 en celular: sin símbolos de fondo y el corte en línea fina (sin muros negros, vanos ni terreno achurado).
- Modelo BIM de arquitectura en Revit: en el entregable de planos, el corte de Estudio, el proceso, las preguntas, el hero y el SEO.
- Imagen para compartir rehecha ("Ve tu proyecto terminado") con nombre nuevo (og/galezo-proyecto.jpg) para que WhatsApp no use la vieja de su caché.

## 2026-10-31 · Planos reales de Ulises en las secciones 02 y 05
- Fuente: PLANOS ARQUITECTONICOS - CASA JAVIER BAQUERO.pdf (Revit, 10 láminas). Se usan la planta del primer nivel (lámina 1) y la fachada norte (lámina 5), recortadas sin cajetín: no aparece el nombre ni el logo del cliente.
- src/assets/planos: planta-color.jpg, planta-linea.jpg (misma planta solo en línea, sacada de la de color) y fachada.jpg.
- 02: Planos = la planta se dibuja en línea de izquierda a derecha con un lápiz azul y luego entra el color. Recorrido = la planta suave con la línea y la cámara recorriendo garaje, estar, sala, comedor y cocina. Cantidades = etiquetas con las áreas reales del plano (sala 73,05; garaje 32,38; comedor 25,74; estar 25,00; cocina 13,55 m²). Sin cambios de texto.
- 05: lote, zonas e idea siguen siendo el dibujo animado; el plano (03), la fachada (04) y "para construir" (05, planta a color + cuadro de cantidades) son las láminas reales. El lote dibujado se oculta en 03 y 05 para que no se cruce con la planta real.
- Las capas sobre la planta usan el mismo sistema que la imagen (1100 × 538) y el marco se ajusta con container queries para que la planta quepa entera en celular.
- (ajuste) Dibujos con más profundidad y definición: contorno grueso en aristas principales y fino en detalles, contraste local para separar planos, achurado en tres direcciones según la sombra y aguada de grafito. Archivos *-dibujo.jpg.
- (ajuste) Se quita el inodoro que aparecía en la sala de la planta (planta1-*.jpg). La pestaña Planos de la 02 es ahora un mini juego de láminas reales que pasan solas (planta 6,2 s; las demás 4,5 s) y se pueden elegir con chips: Planta → Corte (lámina 3) → Fachada (lámina 5) → Modelo 3D (perspectiva sur-oeste, lámina 7). La nota del pie cambia con la lámina. Pedido del cliente: "corte, fachada y modelo 3D".

## 2026-10-31 · Servicios: de 6 a 4
- Diseño de vivienda (campestre y urbana) · Remodelación e interiores · Comercial e institucional (locales y obra pública) · Proyectos ejecutivos ("toda la ingeniería y la arquitectura del proyecto", palabras del cliente; solo como servicio, sin pregunta extra en el formulario).
- ids: vivienda, remodelacion, comercial, ejecutivo (service_id en dataLayer y hoja). Slugs nuevos y redirecciones 301 en vercel.json desde los 6 anteriores.
- Mesa de maquetas (sección 03) = los 4 servicios; se quita el bloque "También diseñamos". Maqueta nueva ejecutivo(): estructura a la vista (columnas y losas en azul).
- Proyecto ejecutivo (confirmado 2026-11-01): arquitectura + estructural, hidrosanitaria y eléctrica por ingenieros aliados que Galezo coordina; se entrega listo para radicar la licencia (el cliente la tramita). Pendiente: planos reales de ingeniería para mostrar.

## 2026-10-31 · Auditoría SEO técnico
- Medido: versión de lanzamiento (PUBLIC_PREVIEW=false) con SEO 100, accesibilidad 100, buenas prácticas 100; sitio en vivo con rendimiento 98–99 en móvil (LCP 1,9 s, TBT 0, CLS 0–0,013). El SEO en vivo sale 66 solo por el noindex de la vista previa.
- Corregido: el H1 se leía "terminadoantes" (faltaba espacio entre líneas); descripción del inicio de 256 a 156 caracteres; FAQ "lo levante"; alt repetido en logos de clientes (el nombre va escrito debajo).
- Servicios con bandera ready en lib/servicios.ts: al marcarla, la página deja de ser noindex y entra sola al sitemap.
- robots.txt se deja abierto a propósito: si se bloquea el rastreo, Google no ve el noindex.

## 2026-10-31 · Diseño de vivienda como landing de pauta
- Estructura por preguntas del visitante: hero (¿es lo que busco?) · casa real nivel por nivel (¿saben hacerlo?) · "Construir sin diseño sale más caro" (¿por qué diseñar?) · lo que recibes · cómo trabajamos · quién diseña · preguntas · cierre. Las últimas cinco son las secciones del inicio (prop n para renumerar).
- Rechazados y guardados en archive/vivienda: "Cada lote pide otra casa" (maquetas genéricas) y "Del plano a la casa" (redundante: planos otra vez).
- Pendiente de Ulises: tiempos de diseño, si incluye licencia/ingenierías, testimonios; preguntas propias de vivienda.
- (ajuste) Cada sección cabe en una pantalla (medido en 390×664, 320×568, 1280×720 y 1440×900). Hero de vivienda a 100svh con el modelo ocupando lo que sobra; "Construir sin diseño" fija en celular con una situación por paso de scroll (4 a la vista en escritorio). Ajustes de alto en Proceso, Lo que recibes, Estudio y Servicios para celulares bajitos (también mejoran el inicio). El pie es la excepción: la marca grande se revela al final del scroll.
- Error encontrado: las páginas sin Hero.astro no marcaban html.ready y la red de seguridad de Base apagaba a los 2,5 s todas las animaciones y las secciones con scroll. HeroVivienda ya marca ready; cualquier página nueva debe hacerlo.
- (revisión vivienda) Hero con una línea de respaldo bajo el botón ("+70 proyectos diseñados · obra pública construida en el Cesar"; en celular solo la cifra). En esta página las secciones reutilizadas van sin botón propio (prop cta={false}): quedan el de la cabecera, el del hero y el del cierre. "Cómo trabajamos" usa aquí la planta de habitaciones (props plano/planoColor) para no repetir la del primer nivel. Preguntas y FAQPage propias (sin "¿Diseñan locales?"). Láminas de "Lo que recibes" rotuladas "casa en ladera".
- PENDIENTE (Ulises): renders de la casa en ladera u otras casas; 1–3 testimonios de vivienda; cuánto tarda un diseño de casa; si incluye licencia e ingenierías → preguntas propias de vivienda y página de Proyectos ejecutivos.

## 2026-10-31 · Página Comercial e institucional
- Misma estructura de landing: hero (fotos reales de obra construida en la lámina del inicio, cajetín con obra/ciudad/año) · 01 "Diseñamos para quien contrata la obra" (entidades públicas, constructoras, comercio; logos reales por grupo, comercio sin logos) · 02 Proyectos (Obras del inicio sin botón ni fila de clientes, para no repetir logos) · 03–07 del inicio sin botones.
- Obras acepta n, cta y conClientes. Ojo: en .astro no puede ir un comentario HTML dentro de una expresión {cond && (...)}: rompe la compilación.
- Pendiente (Ulises): planos o renders de un proyecto institucional (colegio o coliseo) para "Lo que recibes" y "Cómo trabajamos" en esta página; hoy muestran la casa en ladera.
- (rehecha) Comercial e institucional sin secciones del inicio (no eran coherentes: mostraban la casa en ladera a un público institucional). Estructura: hero · 01 Para quién · 02 "Cada obra tenía un reto" (mirador, coliseo, cuatro colegios: reto → lo que hicimos, dibujo a lápiz → foto con el scroll) · 03 "Del diseño a la contratación" (4 pasos sobre una línea) · 04 "Un estudio con obra construida" (+70, 6, desde 2021, 9 + Ulises con su cargo real) · cierre. Base real: portafolio p. 5 y 7–13.
- (ajuste) "Para quién": entidades públicas y constructoras como tarjetas protagonistas; comercio en una línea aparte ("También diseñamos locales…"). Se quitó toda mención de que Ulises formula proyectos para licitación en la Gobernación o que trabajamos "con la Gobernación desde 2021": puede leerse como que ayudamos a ganar contratos. La Gobernación solo aparece como contratante de cada obra y en los logos.

## Sección BIM en el inicio (2026-11-01)
- Pedido de Ulises: mostrar la tecnología (modelo BIM de arquitectura en Revit). Nueva sección 06 "Tu proyecto se construye primero en el computador" entre Cómo trabajamos y Quién diseña; Estudio, Preguntas y Cierre pasan a 07, 08 y 09.
- Fija con el scroll: las 4 vistas reales del modelo (noreste → sureste → suroeste → noroeste); la primera pasa de línea a materiales. Una razón por vista: modelo con medidas reales · planos que coinciden · cantidades medidas en el modelo · verlo antes de construir. Brújula y cajetín giran con la vista. Plomada nueva "giro".
- Para no repetir recursos: las vistas del modelo solo se usan aquí; se quitó la lámina "Modelo 3D" de Lo que recibes.
- Por confirmar con Ulises: que las cantidades de obra salen del modelo de Revit.
- Hero de Proyectos ejecutivos en pausa: el usuario ve los mismos planos repetidos en toda la web.

## Hero de vivienda: una sola fachada en tarjeta (2026-11-01)
- Pedido: meter la pieza del hero en una tarjeta con la figura de la marca y dejar una sola imagen animada.
- Fachada oeste sacada del PDF de Ulises (lámina P4) en dos capas: ejes y niveles (vector del plano) y la fachada (imagen, cielo quitado). Animación: se trazan ejes y niveles de arriba abajo, luego la fachada se levanta desde el piso con una línea de nivel azul. Cajetín: brújula al oeste, "Fachada oeste · el frente sobre la calle", escala 1:50 (dato del plano). Sin arrastre ni carrusel.
- Archivos: src/assets/vivienda/oeste-fachada.png y oeste-lineas.png. Las fachadas anteriores (oeste/este-hero) quedan sin uso.

## Hero de Proyectos ejecutivos sin planos (2026-11-01)
- El usuario pidió no repetir más los planos de la casa en ladera. Pieza nueva: vista explotada de un proyecto en 4 capas (arquitectura, estructural, hidrosanitaria, eléctrica), cada una con su simbología; se trazan una tras otra, corre el agua y la corriente, y se apilan en "Un solo paquete" en bucle mientras se ve. Es un esquema del servicio (sin medidas ni datos), no un proyecto.
- Cajetín: "4 disciplinas, 1 paquete" · "Coordina Galezo Studio"; el texto cambia entre "por capas" y "en un solo paquete".

## Ejecutivos · 01 "Lo que incluye" (2026-11-01)
- "Cuatro respuestas antes de construir": carpeta con separadores (A, E, HS, EL); cada lámina responde una pregunta de quien construye y trae un detalle dibujado de su disciplina (muro y puerta, columna con zapata y cargas, tubería con agua y llave, tablero con circuitos y puntos de luz), qué resuelve y qué recibes. Fija con el scroll; las pestañas se tocan.
- Entregables de ingeniería escritos con lo usual en Colombia (NSR-10, RETIE): planos estructurales + memoria de cálculo; planos hidrosanitarios + isométricos; planos eléctricos + cuadro de cargas. POR CONFIRMAR con Ulises.
- Inicio: se quitó la nota "cuéntanos de tu lote y lo hablamos por WhatsApp" del héroe.

## Ejecutivos · 02 "Tú hablas con uno, nosotros con todos" (2026-11-01)
- Diagrama de quién habla con quién con interruptor "Por tu cuenta / Con Galezo": hilos enredados hacia los cuatro profesionales y choques ("el tubo atraviesa la viga", "la caja cae en la columna") → una línea tuya a Galezo y de ahí en orden a las cuatro disciplinas, con chulos. Pasa solo a "Con Galezo" al entrar; se puede tocar.
- Promesas: un solo contacto, revisamos que los planos coincidan antes de entregarlos, un responsable para ajustes. Confirmar con Ulises que revisan la coordinación entre disciplinas.

## Ejecutivos · 03 "Así llega tu proyecto a la obra" (2026-11-01)
- Ruta dibujada con 4 paradas (Diseñamos · Calculamos · Radicas · Construyes); la carpeta del proyecto la recorre con el scroll y se detiene en cada parada; la línea se pinta en azul detrás. Ficha con "Lo hace Galezo" / "Lo haces tú": desde Radicas la carpeta pasa a tus manos (cambia a oscura). Distinta a la línea de pasos de Comercial.
- Datos usados: la licencia la radica el cliente (confirmado), ingenieros aliados (confirmado), revisión por etapas (ya usado en Comercial).

## PENDIENTES (corte 2026-11-01)
Proyectos ejecutivos (página armada: hero, 01 Lo que incluye, 02 Un solo responsable, 03 Así llega a la obra, cierre; sigue en noindex):
- 04 Preguntas: falta de Ulises cuánto tarda un ejecutivo, si lo hacen sobre un diseño que trae el cliente y cómo se cobra.
- Confirmar con Ulises: entregables de cada ingeniería (memoria de cálculo, isométricos, cuadro de cargas), que revisan la coordinación entre disciplinas, planos reales de ingeniería para mostrar.
Inicio:
- Confirmar que las cantidades de obra salen del modelo de Revit (sección BIM, razón 3).
Remodelación e interiores: página por armar; falta material (fotos antes/después o renders de interiores y qué incluye).
Vivienda: renders, testimonios, tiempo de diseño, si incluye licencia e ingenierías.
Lanzamiento: GTM, GA4, Meta, Ads; PUBLIC_PREVIEW=false; Search Console, Bing, Google Business Profile; tablero de leads.

## Clientes en cajetín y +10 años (2026-11-01)
- Experiencia: "+10 años" (dato del usuario) en tarjeta del héroe del inicio, Quién diseña y Cifras de comercial.
- Componente Clientes.astro: los 9 clientes dentro del cajetín de un plano (rótulo "Cliente 01…", logo y nombre por casilla; pie con +70 proyectos, +10 años, Valledupar, Cesar). Se traza el marco y cada logo entra como sello. En escritorio la casilla 10 es "Tu proyecto" y abre el cotizador. Distinto a la fila de clientes del inicio.
- Comercial: 05 Clientes antes del cierre (06). Ejecutivos: Obras sin fila de clientes (04), 05 Clientes, 06 Quién diseña, cierre 07.

## Marbal Ingeniería y clientes en vivienda (2026-11-01)
- Cliente nuevo: Marbal Ingeniería (empresa privada, vivienda). Logo reconstruido desde una captura (círculo negro): ícono dorado original, texto pasado a tinta oscura para fondo claro, fondo transparente, 8× con bordes suavizados → src/assets/clientes/marbal-ingenieria.png. Pedir a Marbal el logo original en vector cuando se pueda.
- Ahora son 10 clientes: inicio (fila de clientes, 5 × 2), comercial (tarjeta Constructoras y cifra "10 entidades y empresas"), cajetín de comercial y ejecutivos.
- Vivienda: 05 Clientes solo con empresas privadas con las que se ha diseñado vivienda (A Construir, HRS Ingeniería, Marbal Ingeniería); Quién diseña 06, Preguntas 07, Cierre 08.
- El cajetín se adapta al número de clientes: la casilla "Tu proyecto" completa la última fila (en escritorio se oculta si la fila ya está llena); con 10 clientes en celular las casillas son más bajas y sin nombre en pantallas cortas.

## Cambio de marca y correcciones de Ulises (2026-11-03)
Fuente: carpeta "GALEZO STUDIO - MARCA/" (logos corregidos y "correcciones pagina.txt"; no se sube al repo).
- Color de marca: azul #0080C1 → petróleo #36727C (mismo monograma). brand-ink #2C5F68, brand-soft #E4EFF0, fondo tenue #F2F7F7. Se reemplazaron todos los azules escritos a mano (equivalentes de igual luminosidad) y se recolorearon íconos, favicon e imagen para compartir.
- Servicio "Remodelación e interiores" → "Remodelación", con dirección /servicios/remodelacion (redirecciones 301 desde la anterior y las viejas).
- Textos de Ulises en "¿Qué vas a construir?" (vivienda, remodelación, ejecutivos), con redacción ajustada para que la sección quepa en una pantalla. Ejecutivos suma aires acondicionados y red contra incendios "si se requiere". En celular la descripción va sin título (la etiqueta elegida ya lo dice).
- Proyectos: "Lo que diseñamos se construye" (antes "dibujamos"). El cambio boceto → render queda pendiente de los renders.
- Clientes particulares: casilla con ícono de persona (línea, color de marca) en la fila de clientes del inicio (6 + 5 en escritorio) y en el cajetín de servicios (también en vivienda). En celular su nombre siempre se ve.
- Foto profesional de Ulises (src/assets/ulises-pro.jpg; recorte del rostro en ulises-rostro.jpg) reemplaza la provisional en héroe, Quién diseña y Cifras.
- Datos de contacto en un solo archivo: src/lib/contacto.ts (página de contacto, schema y política). Cambiar ahí cuando lleguen el correo corporativo y el WhatsApp Business.
- Menú: Servicios · Contacto · El arquitecto · Blog (la página actual queda marcada).
- Página /contacto: la valla de obra (arquitecto responsable + WhatsApp, correo, Instagram, ciudad). Parales que suben, valla que se monta, datos en orden. Botón principal: el chat. Evento contact_click con link_type (solo el canal). noindex hasta aprobar.
- Página /arquitecto: foto profesional grande que se descubre como una lámina, presentación del portafolio en primera persona (sin cifra de años) y trayectoria sin fechas + programas. noindex hasta aprobar.

## PENDIENTES (corte 2026-11-03)
Dudas para Ulises: años de experiencia (portafolio dice 6, la web dice +10); fachada que da a la calle (este-oeste, norte o sur); ícono de remodelación; si las 9 etapas aplican a todos los servicios; dirección de oficina y horario.
Material de Ulises: renders de I.E. Alfonso López, Instpecam, Mirador Ecce Homo y CASD; imagen de su diseño para el héroe del inicio; resto de proyectos; correo corporativo y WhatsApp Business.
Por hacer cuando respondan: proceso en 9 etapas (inicio), fachada frontal en vivienda, boceto → render en Proyectos, héroe del inicio con su imagen, ícono de remodelación.

## Ajustes (2026-11-03, tarde)
- Correo nuevo del estudio: galezostudio@gmail.com (en src/lib/contacto.ts; lo usan contacto, política y schema).
- Quién diseña: foto profesional a medio torso, en color y vertical (4:5), en src/assets/ulises-torso.jpg. El corte cede la altura en celular para que la sección siga cabiendo.
- Clientes particulares: se quitaron (ni casilla ni línea). PENDIENTE: sección propia igual a la de clientes, con cajas de reseñas de clientes particulares, cuando haya testimonios reales.
- Cajetín: la casilla "Tu proyecto" (abre el cotizador) va siempre, también en escritorio. Con filas llenas de cinco pasa a seis columnas para que complete la última fila (10 clientes: 6 + 4 y Tu proyecto de dos casillas).
- Confirmado por Ulises: las 9 etapas del proceso aplican a todos los servicios.

## Héroe del inicio con la casa de Ulises (2026-11-03, noche)
- La casa es diseño de Ulises (fachada principal en lápiz de color, confirmado). Archivo: "sketch 2 s2.png" (7912 × 4500, ampliado desde ~1280; en web se ve bien). Se guardan dos versiones de 3200 px: casa-color.jpg y casa-lapiz.jpg (grafito sacado del mismo dibujo). En la web pesan ~360 KB en celular y ~490 KB en escritorio retina (WebP, calidad 72).
- Reemplaza el boceto hecho en código y las muestras de "prueba otro acabado". Los textos del héroe no se tocaron.
- Entrada: aparece a lápiz y el color se pinta de izquierda a derecha con el lápiz de la marca en el borde (par de translate opuestos, compuesto). El cajetín pasa de "Boceto" a "Fachada".
- Escritorio: notas a mano a los lados (muro en piedra, jardinera, celosía en madera, voladizo); al pasar el mouse se atenúa todo menos ese elemento.
- La casa crece según el alto de la pantalla para que el techo siempre quede bajo los botones (medido de iPhone SE a 1920 × 1080). En celular va por encima de la firma de Ulises. En iPhone SE se oculta "Diseños ya construidos" (sale en Proyectos).

## Héroe: calco que se dibuja (2026-11-03, corrección del usuario)
- La primera versión (imagen encogida para no chocar con el texto) "quedaba en un pedacito". Ahora la casa va apoyada abajo, grande, con la calle recortada (dibujo de 3200 × 1530).
- Calco (src/lib/calco.ts): 165 líneas rectas de la arquitectura medidas sobre su dibujo y ajustadas a los trazos reales (pórticos, volumen, muros, vanos, lamas, celosía). Se dibujan solas en 3 s con el lápiz recorriendo cada línea; el suelo y el andén siguen hasta los bordes de la lámina, con pastos y pájaros.
- Luego entra su dibujo a lápiz, el calco se retira y el color se pinta de izquierda a derecha. Notas a mano en escritorio (texto fuera del dibujo). La escuadra subió para no chocar con las notas.
- Ancho en escritorio: min(242svh − 1040px, ancho − 400px, 1500px): el techo queda bajo los botones de 720 a 1080 px de alto.
- (misma noche) Cambio a la versión panorámica que trajo el usuario ("Fachada contemporánea entre vegetación tropical.png", 2103 × 748, ampliada a 3200 × 1138 con enfoque suave). Calco rehecho sobre ella (164 líneas). En escritorio cubre todo el ancho: el script la ubica para que el techo quede bajo los botones; si hace falta baja y recorta la calle, y solo en pantallas muy bajas se achica. Notas como etiquetas de papel sobre el dibujo (muro en piedra, celosía en madera, voladizo). Firma de Ulises sobre papel en escritorio. Tableta vertical: texto centrado (la panorámica siempre deja cielo libre).

## Héroe con láminas a línea (2026-11-04)
- El usuario entregó dos láminas sin color con las medidas del héroe original: computador 2880 × 1800 (casa del 24 al 76 % del ancho) y celular 1200 × 1500. Se pasaron a tinta sobre transparencia (src/assets/hero/lamina-ancha.png y lamina-alta.png) para fundirse con el papel sin bordes.
- Calco (lib/calco.ts) medido sobre la lámina de computador y llevado a la de celular por escala. Se dibuja en 3 s con el lápiz; luego entra el dibujo completo y el calco se retira; el cajetín pasa a "Fachada".
- Ubicación por script: en computador la lámina cubre el panel; si el techo tocaría el texto, baja y se recorta el suelo, o se achica lo justo (medido de 1024 × 768 a 1920 × 1080). En celular va de lado a lado con la base sobre la firma, y el texto se centra en el cielo que queda.
- Notas en computador: muro en piedra y celosía en madera (voladizo se quitó: se cruzaba con la otra nota en portátil).
- Sin color por ahora (el usuario lo pidió así para que no se pierdan los demás elementos). Opcional: aguada suave al final.
- Color (2026-11-04): aguada sacada de la versión a color de la misma casa (sin líneas ni cielo, bordes que se pierden como acuarela), alineada con las láminas y puesta debajo del trazo (aguada-ancha.png / aguada-alta.png). Se pinta de izquierda a derecha a los 4 s con el lápiz en el borde; los árboles de los costados quedan a línea, como el héroe original. El cielo queda en papel para que el texto se lea.
- Corrección (2026-11-04, "deja todo mocho"): el color se cortaba a mitad de los árboles. Ahora toda la lámina lleva aguada: verde en los árboles de los costados y en las matas del frente (sale de la densidad del propio trazo, con dos verdes mezclados), la casa con los colores de su versión a color. Sin halos sobre muros ni líneas del suelo. Las notas se ocultan solas si en una pantalla caen sobre el texto o las fotos de obra.

## Correcciones de Ulises (2026-11-04)
- "Diseñamos en todo Colombia" → "Diseñamos internacionalmente" (pie, cotizador, preguntas frecuentes, contacto). Las descripciones para Google siguen diciendo "en Colombia" (ahí está la búsqueda).
- Experiencia: +6 años (dato del portafolio; reemplaza +10 en héroe, Quién diseña, cajetín de clientes y Cifras de comercial).
- Proyectos: +60 diseñados (reemplaza +70 en héroes de servicio, fila de clientes, cajetín y Cifras).
- Logo de la cabecera más grande: 16,5 px de base en celular (antes 14) y 19 px en computador (antes 15,5).

## WhatsApp flotante y medición de contacto directo (2026-11-04)
- Botón flotante de WhatsApp directo (pedido de Ulises): círculo verde abajo a la derecha; en computador "Escríbenos" se despliega al pasar el mouse (la píldora fija tapaba contenido). Aparece después del héroe, se esconde con el chat abierto y en el cierre, y no está en /contacto. Saludo según la página (lib/contacto.ts → saludos): general, vivienda, remodelación, comercial, ejecutivo y perfil de Ulises; todos terminan en pregunta.
- Medición: todos los enlaces directos (flotante, /contacto, Instagram del pie, correo de la política) llevan data-contact + data-cta y Base.astro registra un evento por canal: contact_whatsapp, contact_email, contact_instagram (link_type, cta_id = qué botón). Probado: sin número ni correo en el dataLayer. Tabla y activador CE - contacto en docs/medicion.md. No es conversión de pauta.
- "Diseñamos internacionalmente" confirmado. Descripciones para Google: "en Colombia y el exterior" (mantiene la palabra que se busca).

## Fachadas de frente en "Lo que recibes" y el proceso (2026-11-04, pedido de Ulises)
- La fachada norte (lateral, sobre la ladera) se reemplaza por las dos fachadas de frente de la lámina P4 de la casa de Javier Baquero: Este (cinco niveles) y Oeste (la de la calle, con garajes), lado a lado a la misma escala 1:50, apoyadas en su terreno, sobre el cielo de plano de las demás láminas, sin cajetín ni nombre del cliente. El tercer dibujo de la P4 es un corte (Sección BB'), no se usa.
- Archivo: src/assets/planos/fachada.jpg (3014 × 1570). Lo usan la pestaña Planos de "Lo que recibes" (nota "fachadas este y oeste") y la etapa de fachada del proceso.

## Proyectos: render → obra (2026-11-08, material de PROYECTOS 2)
- La línea de "Lo que diseñamos se construye" ahora compara la obra real (izquierda) con el render de Ulises (derecha) donde el render y la foto se tomaron desde el mismo frente: Pórtico Los Corales (render de noche → foto de noche), Multicampus Universitario Codazzi y Coliseo de Tenis de Mesa (render → estructura metálica en obra). Cada render se alineó en perspectiva sobre su foto (homografía con 6–10 puntos de la fachada) y los dos se recortan igual: src/assets/obras/ln/{corales,multicampus,coliseo-obra}.jpg + *-render.jpg.
- Instpecam, Ecce Homo, CASD, Alfonso López y José Eugenio siguen con el dibujo a lápiz sacado de su foto: sus renders están tomados desde otro ángulo y no calzan con la línea. La etiqueta de la derecha dice "render" o "dibujo" según el proyecto.
- Ocho proyectos (antes seis): seis construidos y dos en obra. Subtítulo: "Ocho proyectos que diseñamos: seis ya construidos y dos en obra." (ya no dice "obra pública en el Cesar": Los Corales es un conjunto privado).
- Los Corales y Multicampus no están en el portafolio: se muestran sin año ni m², y la ciudad solo donde se sabe (Multicampus → Agustín Codazzi). PENDIENTE (Ulises): ciudad, año, m² y cliente de los dos.
- El Coliseo deja de mostrarse como render a la izquierda: ahora la izquierda es la foto real de la estructura.

## Remodelación: página propia, héroe (2026-11-08)
- /servicios/remodelacion deja la plantilla "en construcción" y pasa a página propia (own: true; sigue noindex hasta ready). Por ahora: héroe + cierre; las demás secciones se arman una por una.
- H1 "Remodelación y diseño de interiores" (lleva las dos búsquedas). Bajada con las palabras de Ulises: distribución, acabados, mobiliario, carpintería y cielo raso. Botón data-cta="remodelacion-hero" data-service="remodelacion".
- Pieza visual: render real de la sala con cocina abierta de la casa unifamiliar en Valledupar (SALA_3). Entra como dibujo a lápiz sacado del mismo render (XDoG, src/assets/remodelacion/sala-lapiz.jpg), una línea de obra lo vuelve color y aparecen cinco notas que señalan en la imagen lo que dice el servicio: cielo raso (luz perimetral), distribución (sala abierta a la cocina), carpintería (listones de madera), acabados (muro en piedra) y mobiliario (sala en L). En celular la nota dice solo qué es.
- La tarjeta toma la proporción del render (sin recorte) para que las notas caigan siempre en su sitio.
- Copy: estos interiores son de una casa nueva; no se presentan como remodelación. Antes/después real: solo Pórtico Los Corales (para una sección siguiente).

## Remodelación · 01 "Lo que diseñamos por dentro" (2026-11-08)
- El héroe señala las cinco cosas en una sala; esta sección le da a cada una su propia imagen de la misma casa (unifamiliar en Valledupar): Distribución → planta del primer nivel (la que ya usa la web; sala, comedor y cocina en un solo espacio, como en los renders), Acabados → baño principal, Mobiliario → habitación principal, Carpintería → cocina con isla, Cielo raso → sala de TV con luz indirecta.
- Pasan solas cada 6 s con barra de avance; la cámara se acerca despacio al punto de lo que se nombra (transform-origin por imagen). Al tocar una pestaña (o deslizar la imagen en celular) se detiene en esa.
- Escritorio: título y lista a la izquierda (la descripción se abre en la activa), imagen a la derecha con su cajetín (espacio, detalle, 0X / 05); la imagen toma su tamaño del alto disponible.
- Celular: pestañas numeradas arriba de la imagen (abajo quedaban bajo el botón de WhatsApp), el nombre y la descripción sobre la imagen con degradado; en la planta el degradado es de papel y el texto de tinta.
- Sin botón de cotizar (el héroe y el cierre lo tienen, como en las otras páginas de servicio). Las pestañas son controles, no CTA: no llevan evento.

## Cotizador: indicativo de todos los países (2026-11-08)
- Motivo: una persona en España quiso cotizar y el formulario le rechazó el número (traía "+57" fijo y solo validaba celulares colombianos; la salida de escribir el número con + no se veía).
- El "+57" pasa a ser un selector con los 247 indicativos de la UIT (src/lib/paises.ts), nombres en español del navegador, y arriba los que más cotizan: Colombia, España, Estados Unidos, México, Panamá. Se ve como "+34 ⌄"; encima va el select nativo (rueda del sistema en celular, búsqueda escribiendo en computador).
- País preseleccionado sin pedir ubicación: 1) zona horaria del visitante (Europe/Madrid → España; America/Bogota → Colombia aunque el teléfono esté en inglés), 2) si la zona no está en la tabla y no es de América, la región del idioma del teléfono (ja-JP → Japón), 3) Colombia.
- Validación por país (lib/lead.ts → normalizePhone(numero, indicativo)): Colombia igual que antes; largo exacto en los mercados principales (España 9, EE. UU. 10, México 10, Panamá 8…); se quita el 0 que se marca dentro del país (salvo Italia), el indicativo si lo escribieron sin +, y en Argentina se agrega el 9 de WhatsApp. Con + adelante se acepta cualquier país. A la base llega en E.164 (+34612345678). Pruebas nuevas en tests/lead.test.ts.
- Ejemplo y error cambian con el país: "Tu número sin el +34" / "Revisa el número. Escríbelo sin el +34."; en Colombia el error sugiere cambiar el +57 si el número es de otro país.
- Ojo para pruebas: en local PUBLIC_LEADS_URL apunta a la hoja real. Las pruebas automáticas deben bloquear script.google.com.

## Remodelación · 01 rehecha como muestrario (2026-11-08, pedido del usuario)
- Se descartan el acercamiento de cámara (trillado), las pestañas con barra de avance (eran las de Proyectos) y la planta del primer nivel (está en toda la web).
- Nuevo recurso, propio de esta página: un muestrario de acabados. Cinco muestras cuadradas con el corte a 45° de la marca, la perforación del muestrario y sombra de papel, puestas a mano (cada una con su inclinación). Cada muestra está recortada de una imagen real: planta del nivel -2 (lámina 2 del PDF, sin uso en la web; recorte de la escalera), mármol del baño principal, cama de la habitación principal, madera de la escalera del nivel -2 (render nuevo) y luz indirecta de la sala de TV.
- Al elegir una muestra: se endereza y se levanta; a la derecha (arriba en celular) aparece la imagen completa con el hueco de donde salió, en línea punteada con su número, y el resto se apaga con papel. Ficha con la decisión (Distribución, Acabados, Mobiliario, Carpintería, Cielo raso) y cajetín (espacio, detalle, muestra 0X/05). Pasa sola cada 5,2 s hasta que la persona elige.
- Celular: las muestras quedan puestas sobre el borde inferior de la imagen; sin cajetín; la bajada solo en pantallas altas; en celulares angostos solo el número bajo cada muestra; la ficha deja libre el lado del botón de WhatsApp. Los recortes van en la mitad alta de cada imagen para que las muestras no tapen el hueco.
- Archivos: src/assets/remodelacion/{planta-nivel-2,escalera}.jpg y muestra-*.jpg. Se borró cocina.jpg (ya no se usa).

## Remodelación · 02 "Así estaba, así quedó" (2026-11-08)
- La única remodelación con fotos reales de antes y después: Pórtico Los Corales (antes = foto con los dos arcos; el diseño = render de día; después = foto de noche de la obra terminada). Archivos: src/assets/remodelacion/corales-{antes,diseno,despues}.jpg.
- Recurso propio (Los Corales ya sale en Proyectos con la línea render → obra): una pila de tres fotos impresas con borde blanco y su rótulo a mano. La de arriba sale volando hacia un lado y vuelve al fondo; pasan solas cada 4,2 s, se tocan o se arrastran con el dedo (si se sueltan lejos, salen volando hacia ese lado). Línea de tiempo de tres puntos (Antes · El diseño · Después) que también lleva a cada foto, y la frase de cada momento.
- Fondo hueso (la 01 es blanca). Textos solo con lo que se ve en las fotos; la ciudad del conjunto sigue sin confirmar (no se dice).

## Remodelación · página completa (2026-11-08)
- Estructura final: Héroe (lápiz → render con notas) · 01 Por dentro (muestrario) · 02 Antes y después (pila de fotos de Los Corales) · 03 Locales y espacios públicos (mosaico) · 04 Quién diseña (Estudio, sin botón) · 05 Cierre. Sigue noindex hasta que se marque ready en lib/servicios.ts.
- 03: interiores del CCMV (dos baños y dos vistas del Hall de la Fama) y la sala del Museo de Juglares, todos con el rótulo "Diseñado" (no está confirmado que se hayan construido). Escritorio: mosaico de una grande y cuatro chicas; celular: fila que se desliza con la siguiente asomando y contador 1 / 5. No se usa el bar del complejo de pádel (sale la marca de una cerveza).
- Sin preguntas frecuentes propias: PENDIENTE de Ulises (cuánto tarda, si hace la obra, si se puede con la casa habitada).
- Cierre: la lámina del cajetín ya no dice "08 / 08" fijo en todas las páginas; toma el número del cierre de cada una.

## Revisión antes de subir: rendimiento y carga (2026-11-08)
- Héroe del inicio: se descargaban las dos láminas (ancha y alta) y CSS escondía una (~450 KB de más en celular). Ahora cada capa va en <picture> con una fuente de un píxel para la pantalla donde no se ve (mismas condiciones del CSS); al girar la tableta el navegador trae la otra. Las dos láminas llevan fetchpriority alto (solo se pide la visible).
- LazyImg.astro: imagen que se pide cuando su sección está a menos de media pantalla (la carga diferida nativa adelanta ~2.500 px en redes lentas y arrastraba dos o tres secciones). `later` deja para después (1,2 s y de a una) las que no se ven de entrada (otras diapositivas). Sin JS, <noscript>. Se usa en las secciones 01–03 de remodelación.
- Héroe de remodelación: la prioridad de descarga pasa al dibujo a lápiz (es lo primero que se ve); tamaños pedidos en celular según el ancho real de la tarjeta.
- Medido en celular (4G lento, CPU ×4): inicio 1.315 → 869 KB; remodelación 1.141 → 598 KB; CLS 0 en las páginas de servicio. JS por página 12–19 KB.
- Revisado además: un H1 por página, lang es-CO, datos estructurados válidos, todas las CTA y enlaces de contacto con data-cta, dataLayer sin datos personales (prueba de punta a punta con número de España), sin errores de consola en Safari y Chrome, contenido visible con "reducir movimiento" y sin JS. Descripción de remodelación acortada a 156 caracteres.

## Proyectos: bocetos en vez de filtro blanco y negro (2026-11-09, pedido de Ulises)
- Los dibujos de Instpecam, Ecce Homo, CASD, José Eugenio y Coliseo (este último lo usa "Cada obra tenía un reto" en comercial) parecían fotos con filtro blanco y negro manchado. Se rehicieron como bocetos a lápiz, alineados píxel a píxel con su foto: foto suavizada sin perder bordes (OpenCV), línea de estructura (Canny + diferencia de gaussianas, sin manchas chicas), achurado diagonal solo en las sombras reales (percentiles de la propia foto) con trazo que se corta a ratos, grafito sobre papel hueso con grano. Alfonso López se deja igual (ya era boceto).
- Script: scratchpad de la sesión (boceto.py, con un venv de OpenCV); no forma parte del sitio.
- (mismo día) Ulises pidió renders en vez de bocetos. Instpecam, Ecce Homo, Alfonso López y José Eugenio pasan a render (src/assets/obras/ln/*-render.jpg), pero sus renders están tomados desde otros ángulos (el de Instpecam incluso muestra la fachada amarilla del otro lado): no se pueden alinear. Para ellos la línea es una transición: entra el render completo, la línea lo barre y se queda al 93 % (el render asoma como pestaña y la perilla sigue a la vista para volver a él); la etiqueta "render" se esconde con la línea al borde. Los alineados (Los Corales, Multicampus, Coliseo) siguen quedándose al 80 %. CASD no tiene render: sigue con boceto. Renders de Instpecam y Alfonso López son de WhatsApp (1024 px): pedir originales.
- (mismo día) CASD se apaga por ahora (comentado en Obras.astro): siete proyectos. El subtítulo se calcula solo ("Siete proyectos que diseñamos: cinco ya construidos y dos en obra").
- Los Corales se veía desalineado (Ulises): el muro del nombre está más cerca de la cámara que el pórtico y una sola homografía no podía calzar los dos. Se realineó con 16 esquinas medidas con zoom (columnas, poste, viga, borde inclinado y arranque del muro) y un campo de corrección suave sobre la homografía (OpenCV remap, script flex.py en el scratchpad). Lo construido no es idéntico al render (cambió el letrero), así que se calzan las formas, no los detalles.
- (mismo día) "Cómo trabajamos": en pantallas anchas y bajitas (laptop de 1470 × 736) la planta se salía de la lámina, cortada abajo y a la derecha ("se ve más horizontal"). La celda de las láminas reales no tenía alto fijo y la imagen tomaba su alto natural; ahora grid-template minmax(0, 1fr) y la lámina se ve completa. Verificado en inicio y vivienda en seis tamaños.
- (mismo día) Comercial · "Cada obra tenía un reto" seguía con bocetos y con el render del Coliseo como si fuera obra. Ahora usa los mismos recursos que Proyectos: render debajo y la obra lo cubre con el scroll (Ecce Homo e Instpecam con su render; Coliseo render alineado → foto de la estructura; etiqueta "En construcción"). Regla: un cambio de recurso de un proyecto se aplica en todos los lugares que lo usan (Obras en inicio y ejecutivos, Retos y héroe de comercial).

## Cómo trabajamos: las 9 etapas de Ulises (2026-11-09)
- La sección pasa de 5 a 9 etapas, con los nombres de la lista de Ulises (correcciones, punto 9): Tu espacio y el anticipo · La idea y el concepto · Diseño en plantas y modelo 3D · Diseño de fachadas · Imágenes y video render · Detalles arquitectónicos · Planimetría detallada · Cantidades de obra · Entrega final. En el cronograma y el rótulo van nombres cortos (Tu espacio, La idea, Plantas y 3D, Fachadas, Renders, Detalles, Planimetría, Cantidades, Entrega final).
- Todo con material real de la casa en ladera: 1 lote y 2 zonas (dibujo animado de siempre) · 3 planta en línea + modelo 3D de Revit sujeto con cinta · 4 fachadas este y oeste · 5 render interior a toda la lámina · 6 detalle: la escalera del corte en grande con su llamada "1 detalle escalera" (src/assets/planos/corte-detalle.jpg) · 7 planta a color con cotas · 8 la misma, tenue, con el cuadro de cantidades · 9 el juego de láminas (planta, fachadas, corte, modelo) en abanico.
- Recorrido de scroll 300svh → 560svh. Cronograma con 9 barras; en celular y tableta vertical, en una sola línea numerada. En celular se quita la nota bajo el botón (quedaba bajo WhatsApp).
- Se agrega a remodelación (04 Cómo trabajamos; quién diseña pasa a 05 y el cierre a 06). Comercial y ejecutivos mantienen sus propias rutas (contratación pública y arquitectura + ingenierías). Verificado en inicio, vivienda y remodelación, 7 tamaños, las 9 etapas: todo cabe en pantalla.

## Página /proyectos (2026-11-09, pedido de Ulises)
- Pestaña "Proyectos" en el menú, junto a Blog (Servicios · Contacto · El arquitecto · Proyectos · Blog). Entradas: el menú, "Diseños ya construidos" del héroe del inicio (antes bajaba a #proyectos) y "Ver todos los proyectos" en la sección Proyectos del inicio y de ejecutivos (reemplaza la nota "El mismo rigor…").
- Categorías de Ulises, como en el portafolio: diseñados y construidos · diseñados y en construcción · diseñados · modelados y renderizados (proyectos que no diseñó: modelo 3D y renders). Los filtros solo muestran las categorías con proyectos.
- Datos en src/lib/proyectos.ts e imágenes en src/assets/proyectos/<slug>/NN-obra|render|antes.jpg (la primera es la portada). Solo entran proyectos con categoría confirmada: hoy 8 (construidos: Ecce Homo, Instpecam, Alfonso López Valledupar, CASD, Los Corales, Multicampus; en construcción: Coliseo, José Eugenio). PENDIENTE: la clasificación de los ~37 restantes de la carpeta PROYECTOS (Ulises) — el portafolio completo no llegó.
- Tarjetas: portada; con el mouse asoma la otra cara (render u obra). Ficha en <dialog>: todas las imágenes con su rótulo (obra/render/antes), flechas, deslizar, miniaturas, datos confirmados y "Cotiza un proyecto así" (data-cta="proyectos"; la ficha se cierra para que el cotizador quede encima). Enlazable con #slug. Eventos project_filter y project_open (docs/medicion.md). noindex.
- (mismo día) Cabecera con cinco enlaces: "El arquitecto" se partía en dos líneas y Blog chocaba con el botón. Causa: la barra va centrada con posición absoluta y el navegador solo le daba la mitad del ancho; ahora width: max-content y white-space: nowrap. La cápsula recogida (al bajar) pasa de 760 a 880 px. Barrido de 1024 a 1920 px, arriba y recogida, inicio y /proyectos: ningún enlace se parte ni toca el logo o el botón.

## Recursos de la carpeta vieja (2026-11-09, Ulises borró PROYECTOS)
- Se compararon todas las imágenes de la web con PROYECTOS 2 y el portafolio (huella visual, no por nombre). Venían de la carpeta vieja: los renders de Instpecam (dos) y de Alfonso López (uno). Se borraron.
- Proyectos del inicio y de ejecutivos: Instpecam y Alfonso López salen del deslizador (sin render, misma regla que CASD); quedan cinco: Los Corales, Multicampus, Coliseo, Ecce Homo y José Eugenio.
- Comercial · Retos, caso de los cuatro colegios: la imagen pasa de Instpecam (render viejo) a José Eugenio (render y obra de la carpeta). El texto sigue nombrando los cuatro colegios.
- /proyectos: Instpecam y Alfonso López siguen como construidos, solo con sus fotos de obra.
- Lo demás coincide con PROYECTOS 2 o con el portafolio.

## Proyectos con los datos del portafolio (2026-11-09, pedido de Ulises)
- Carpeta: se trabaja con PROYECTOS 2 (la última de Ulises; la anterior ya no existe). No hay descargas más nuevas.
- Instpecam y Alfonso López: sin renders, solo fotos de obra (en /proyectos, Proyectos del inicio y Retos).
- Cada proyecto del portafolio lleva sus datos y su descripción tal cual (solo tildes y comas corregidas), con los rótulos de la ficha del portafolio: Ubicación, Contratación, Año, Área de intervención y Estado (Diseñado / Construido, Diseñado / En construcción, Diseñado). En Proyectos del inicio va la primera parte del mismo texto (el completo no cabe sobre la foto).
- Nuevo: I.E. Alfonso López Pumarejo de Río de Oro (proyecto 03 del portafolio): diseñado, 2026, 8.464 m², Gobernación del Cesar; renders sacados del portafolio (venían pegados en una sola imagen y se separaron). Con él aparece el filtro "Diseñados". Total: 9 proyectos.
- Erratas del portafolio: el proyecto 06 (Alfonso López Valledupar) dice "en Rio de Oro" en su descripción; en la web se puso Valledupar, como su ubicación. Confirmar con Ulises.
- Los Corales y Multicampus no están en el portafolio: siguen con descripción propia y sin año, área ni cliente. PENDIENTE de Ulises.
- /proyectos: la ficha también se abre al cambiar el enlace (#slug) sin recargar.

## Proyectos según el "portafolio final" (2026-11-09)
- Fuente: GALEZO STUDIO - MARCA/portafolio final.pdf (54 páginas, 37 proyectos). Reemplaza al portafolio del 29 de octubre.
- /proyectos tiene los 37, en el orden, número y sección del portafolio: diseñados y construidos (01–11), diseñados y en construcción (12–16), diseñados (17–30), modelados y renderizados (31–37). Con todos visibles, un título por sección. Ficha con los rótulos del portafolio (Ubicación, Contratación, Año, Área de intervención, Estado) y la descripción tal cual (tildes y erratas corregidas: "Alfondo", "César", "4,780"). Las imágenes son las de cada página del portafolio (src/assets/proyectos/<slug>/); los que ya estaban conservan las de PROYECTOS 2. Se dejó fuera el render del bar del pádel (marca de cerveza).
- Cambios frente al portafolio anterior: sale el Alfonso López de Río de Oro (ya no está); José Eugenio pasa a construido; Los Corales y Multicampus ya tienen ficha (Los Corales 2023, 64 m², Unidad Inmobiliaria Los Corales, "construido por mi empresa"; Multicampus Codazzi, 2025, 4.050 m², Gobernación); el CCMV está diseñado y construido (A Construir, 2025).
- Aplicado también en: Proyectos del inicio (José Eugenio construido; datos de Los Corales y Multicampus: "Cinco proyectos… cuatro ya construidos y uno en obra"), Retos de comercial (los cuatro colegios construidos) y remodelación (CCMV "Diseñado y construido").
- Entrada de las tarjetas: por tarjeta (con 37, la sección es tan alta que nunca se veía el 5 % y en celular no aparecían).
- PENDIENTE (Ulises) — contradicciones del portafolio entre la sección y el estado de la ficha: Multicampus (13) y los dos del CCMV (14, 15) están en "en construcción" pero su ficha dice "Diseñado / Construido"; CAC El Banco (35) y Bomberos Bosconia (37) están en "modelados" pero su ficha dice "Diseñado"; Corpocesar (11, "Levantado") está en "construidos" y repite 15.097 m² de los colegios. En la web: la categoría sigue la sección y el estado sigue la ficha.

## El arquitecto: texto de presentación nuevo (2026-11-12, pedido de Ulises)
- /arquitecto · 01 Presentación: se reemplaza el texto del portafolio viejo por el que envió Ulises, tal cual, en cuatro párrafos (formación y 6 años · viabilización y Fase III · enfoque y BIM · planimetría y entidades). El título "La arquitectura es para las personas" se mantiene; ya no recoge el texto nuevo (más técnico): proponer otro a Ulises.
- En celular el texto se pasaba de la pantalla (hasta 115 px en iPhone 13): va más compacto (0,86 rem, sin la firma a mano). Verificado en cinco tamaños.

## Cómo trabajamos: 8 etapas (2026-11-12, pedido de Ulises)
- Reemplaza las 9 del 2026-11-09: Concepción de la idea (Anticipo) · Esquema básico y distribución de espacios · Definición de plantas finales · Diseño 3D y de fachadas · Renderizado del proyecto · Elaboración de planimetrías detalladas · Cantidades de obra · Entrega final (Entrega). Nombres cortos en el cronograma: La idea, Esquema, Plantas, 3D y fachadas, Renders, Planimetrías, Cantidades, Entrega final.
- Láminas: 1 lote · 2 burbujas de zonas · 3 planta en línea · 4 fachadas + modelo 3D sujeto · 5 render · 6 planta a color con cotas · 7 la misma tenue con cantidades · 8 abanico de láminas. Sale la lámina de detalle (corte de la escalera). Recorrido 560svh → 500svh; cronograma de 8 tramos. Aplica en inicio, vivienda y remodelación. Verificado en cinco tamaños.

## Proyectos destacados (2026-11-12)
- Estrella dorada en la tarjeta (placa blanca con corte a 45°), filtro "★ Destacados" y "★ Destacado" en la ficha. Lista en src/lib/proyectos.ts (DESTACADOS): Parque de la Vida, Mirador Ecce Homo, los cuatro colegios (Instpecam, Alfonso López, CASD, José Eugenio), Coliseo de Tenis de Mesa, Complejo Tamalameque y UMNG Becerril. Criterio: los más grandes o emblemáticos diseñados por Ulises; sin modelados. El portafolio final habla de "destacados y reconocidos": si Ulises tiene su lista, se cambia en esa línea. Evento project_filter con filter = destacados.
- Carpeta del proyecto: ~/Desktop/sitio webs/galezo-studio. En el Escritorio quedó una carpeta-ancla "galezo-studio" con un LEEME.txt (solo para la sesión vieja de Claude); se puede borrar.
