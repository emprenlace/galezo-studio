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
- SEO: Open Graph/Twitter con imagen propia 1200×630 (`public/og/galezo-studio.jpg`, `PUBLIC_URL` para el dominio de hoy), canonical solo en indexables, `noindex` + `PUBLIC_PREVIEW`, JSON-LD `ProfessionalService` + `WebSite` + `FAQPage` (preguntas en `lib/faq.ts`, compartidas con la sección 7), `robots.txt`, `sitemap-index.xml` → `sitemap-paginas.xml` (solo indexables), 404 real ("Este plano no existe").
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
