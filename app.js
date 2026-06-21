'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const panel = $('#panel');
const VERSION = '2.1.0-pro';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const nowText = () => new Date().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
const todayISO = () => new Date().toISOString();
const clampText = (value, max) => String(value ?? '').trim().slice(0, max);

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  }
};

function download(filename, text, type = 'text/plain') {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = filename;
  document.body.append(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 600);
}

function saveEntry(type, title, body, extra = {}) {
  const entries = store.get('entries', []);
  entries.unshift({ id: uid(), type, title, body, date: nowText(), iso: todayISO(), ...extra });
  store.set('entries', entries.slice(0, 1200));
}

function header(title, description) {
  panel.innerHTML = `<h2>${esc(title)}</h2><p class="intro">${esc(description)}</p>`;
  $$('.nav button').forEach(btn => btn.classList.toggle('active', btn.dataset.open === current));
}

function card(title, body, badge = 'Resultado') {
  return `<article class="result"><span class="badge">${esc(badge)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
}

function miniCard(item) {
  const [title, body, category] = item;
  return `<article class="card"><span class="badge">${esc(category || 'Entrada')}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
}

function entryHTML(entry, kind = 'entry') {
  const button = kind === 'dream'
    ? `<button class="tiny danger" data-del-dream="${esc(entry.id)}">Borrar</button>`
    : kind === 'paranormal'
      ? `<button class="tiny danger" data-del-paranormal="${esc(entry.id)}">Borrar</button>`
      : `<button class="tiny danger" data-del-entry="${esc(entry.id)}">Borrar</button>`;
  const tags = entry.tags?.length ? `<div class="pillbox">${entry.tags.map(tag => `<span class="badge">${esc(tag)}</span>`).join('')}</div>` : '';
  return `<article class="entry"><div><span class="badge">${esc(entry.type || kind)}</span><h3>${esc(entry.title)}</h3><small>${esc(entry.date)}</small><p>${esc(entry.body)}</p>${tags}</div>${button}</article>`;
}

const data = {
  tarot: [
    ['El Loco', 'inicio radical, viaje, inocencia peligrosa', 'Cruza el umbral, pero no confundas libertad con impulsividad.'],
    ['El Mago', 'voluntad, técnica, enfoque', 'Tienes herramientas; falta ordenar la intención.'],
    ['La Sacerdotisa', 'secreto, intuición, silencio', 'No fuerces la respuesta: escucha lo que no se dice.'],
    ['La Emperatriz', 'creación, cuerpo, abundancia', 'La idea necesita alimento, tiempo y forma.'],
    ['El Emperador', 'estructura, límite, autoridad', 'Pon reglas antes de pedir resultados.'],
    ['El Hierofante', 'tradición, rito, maestro', 'Aprende el sistema antes de romperlo.'],
    ['Los Enamorados', 'elección, vínculo, deseo', 'Toda elección revela una lealtad.'],
    ['El Carro', 'avance, control, victoria tensa', 'Dirige fuerzas opuestas hacia un mismo eje.'],
    ['La Justicia', 'consecuencia, equilibrio, verdad', 'La pregunta real es qué precio aceptas pagar.'],
    ['El Ermitaño', 'retiro, búsqueda, lámpara', 'Reduce ruido: la pista está en lo pequeño.'],
    ['La Rueda', 'ciclo, azar, giro', 'No todo se controla; sí se interpreta.'],
    ['La Fuerza', 'coraje suave, paciencia', 'Domina sin aplastar.'],
    ['El Colgado', 'pausa, inversión, sacrificio', 'Cambia de ángulo antes de actuar.'],
    ['La Muerte', 'cierre, poda, transformación', 'Algo debe terminar para dejar espacio.'],
    ['La Templanza', 'mezcla, cura, puente', 'Combina extremos sin diluirlos.'],
    ['El Diablo', 'atadura, obsesión, deseo', 'Mira qué te posee mientras crees elegir.'],
    ['La Torre', 'ruptura, revelación', 'Lo falso cae rápido cuando pierde soporte.'],
    ['La Estrella', 'esperanza, guía, limpieza', 'Vuelve a la señal sencilla.'],
    ['La Luna', 'sueño, niebla, imaginación', 'No decidas bajo bruma sin registrar señales.'],
    ['El Sol', 'claridad, vitalidad, exposición', 'La verdad soporta ser vista.'],
    ['El Juicio', 'llamada, despertar, balance', 'Responde a lo que llevas aplazando.'],
    ['El Mundo', 'integración, cierre, viaje completo', 'Cierra el círculo y documenta lo aprendido.']
  ],
  runes: [
    ['ᚠ Fehu', 'riqueza móvil, recursos, energía que circula'], ['ᚢ Uruz', 'fuerza primaria, resistencia, salud'],
    ['ᚦ Thurisaz', 'umbral, defensa, espina, conflicto'], ['ᚨ Ansuz', 'mensaje, palabra, inspiración'],
    ['ᚱ Raidho', 'viaje, ritmo, dirección'], ['ᚲ Kenaz', 'antorcha, técnica, revelación'],
    ['ᚷ Gebo', 'don, alianza, intercambio'], ['ᚹ Wunjo', 'gozo, clan, armonía'],
    ['ᚺ Hagalaz', 'granizo, crisis, interrupción'], ['ᚾ Nauthiz', 'necesidad, fricción, disciplina'],
    ['ᛁ Isa', 'hielo, pausa, inmovilidad'], ['ᛃ Jera', 'cosecha, estación, paciencia'],
    ['ᛇ Eihwaz', 'eje, muerte-vida, resistencia'], ['ᛈ Perthro', 'azar, matriz, secreto'],
    ['ᛉ Algiz', 'protección, alerta, santuario'], ['ᛊ Sowilo', 'sol, victoria, claridad'],
    ['ᛏ Tiwaz', 'justicia, sacrificio, norte moral'], ['ᛒ Berkano', 'nacimiento, hogar, crecimiento'],
    ['ᛖ Ehwaz', 'confianza, movimiento, cooperación'], ['ᛗ Mannaz', 'humanidad, identidad, comunidad'],
    ['ᛚ Laguz', 'agua, emoción, intuición'], ['ᛜ Ingwaz', 'semilla, potencial, cierre interno'],
    ['ᛞ Dagaz', 'amanecer, transformación, umbral luminoso'], ['ᛟ Othala', 'herencia, raíz, territorio']
  ],
  symbols: [
    ['Ouroboros', 'retorno, eternidad, autodevoración; ciclo que se consume para renovarse.', 'Alquimia'],
    ['Pentáculo', 'protección, cinco elementos, microcosmos y cuerpo simbólico.', 'Magia ceremonial'],
    ['Ankh', 'vida, aliento, continuidad y cruce entre mundos.', 'Egipto'],
    ['Triskel', 'movimiento triple, cambio, nacimiento-muerte-renovación.', 'Celta'],
    ['Ojo', 'vigilancia, conciencia, revelación y mirada que protege o acusa.', 'Mediterráneo'],
    ['Mercurio', 'mente, intercambio, mensajero, ambigüedad y transformación.', 'Alquimia/Astrología'],
    ['Azufre', 'voluntad, fuego interno, impulso espiritual y combustión.', 'Alquimia'],
    ['Sal', 'cuerpo, memoria material, conservación y límite físico.', 'Alquimia'],
    ['Árbol de la Vida', 'mapa de emanaciones, senderos y correspondencias verticales.', 'Cábala occidental'],
    ['Vesica Piscis', 'intersección, nacimiento, umbral geométrico y matriz de formas.', 'Arte sacro'],
    ['Espiral', 'trance, crecimiento, retorno, memoria ancestral y viaje interior.', 'Megalítico'],
    ['Rueda Solar', 'ciclo, fuego, estación, centro y orden temporal.', 'Europa antigua'],
    ['Llave', 'acceso, secreto, frontera, permiso y custodia.', 'Iconografía iniciática'],
    ['Laberinto', 'prueba, centro, pérdida controlada y regreso transformado.', 'Mediterráneo'],
    ['Espejo negro', 'reflejo, sombra, visión interior y límite de la percepción.', 'Tradición moderna'],
    ['Rosa cruz', 'unión de materia y espíritu, herida, perfume y conocimiento.', 'Hermetismo'],
    ['Triángulo', 'manifestación, dirección, elemento, ascenso o descenso.', 'Geometría ritual'],
    ['Círculo', 'límite sagrado, totalidad, protección y contención.', 'Magia ceremonial'],
    ['Hexagrama', 'unión de opuestos, arriba-abajo, fuego-agua, pacto.', 'Hermetismo'],
    ['Mano de Fátima', 'protección, bendición, ojo y defensa doméstica.', 'Mediterráneo'],
    ['Cruz ansada', 'vida sostenida, llave del aliento y continuidad.', 'Egipto'],
    ['Serpiente', 'conocimiento, veneno, medicina, muda y peligro.', 'Universal'],
    ['Cuervo', 'mensajero, carroña, inteligencia, presagio y memoria.', 'Folclore'],
    ['Calavera', 'memento mori, umbral, verdad final y despojo.', 'Barroco/Universal'],
    ['Corona', 'soberanía, centro superior, autoridad y sacrificio.', 'Realeza sagrada'],
    ['Reloj de arena', 'tiempo, límite, paciencia y erosión inevitable.', 'Vanitas'],
    ['Puerta', 'paso, iniciación, elección y zona liminal.', 'Arquitectura simbólica'],
    ['Pozo', 'descenso, memoria profunda, agua escondida y riesgo.', 'Folclore'],
    ['Máscara', 'persona, ocultación, teatro, espíritu y doble.', 'Ritual/Teatro'],
    ['Campana', 'llamada, limpieza sonora, advertencia y comienzo.', 'Liturgia'],
    ['Nudo', 'vínculo, destino, bloqueo, promesa y enlace.', 'Magia popular'],
    ['Luna triple', 'ciclo femenino simbólico, fases, crecimiento y declive.', 'Neopaganismo'],
    ['Estrella de ocho puntas', 'orientación, Venus, renacimiento y navegación.', 'Antiguo Oriente'],
    ['Mandorla', 'gloria, intersección de mundos y cuerpo luminoso.', 'Arte sacro'],
    ['Sigilo', 'intención condensada en forma gráfica.', 'Magia moderna'],
    ['Escalera', 'ascenso, prueba, jerarquía y paso gradual.', 'Mística'],
    ['Vela', 'presencia, vigilia, deseo enfocado y tiempo encendido.', 'Ritual doméstico'],
    ['Libro cerrado', 'conocimiento velado, secreto, ley y archivo.', 'Iconografía'],
    ['Cáliz', 'receptividad, pacto, sangre simbólica y contención.', 'Graal'],
    ['Daga', 'corte, decisión, aire, separación y voluntad.', 'Ceremonial'],
    ['Huevo cósmico', 'origen, potencial, mundo antes de abrirse.', 'Mitología comparada'],
    ['Axis mundi', 'eje del mundo, árbol, montaña o columna central.', 'Mitología comparada']
  ],
  grimoire: [
    ['Artemisa', 'protección, sueño, umbral, memoria lunar y tránsito.', 'Hierba'],
    ['Romero', 'memoria, limpieza, vigor, cocina ritual y claridad.', 'Hierba'],
    ['Lavanda', 'calma, descanso, claridad emocional y sueño.', 'Hierba'],
    ['Ruda', 'límite, defensa popular, corte y advertencia.', 'Hierba'],
    ['Salvia', 'purificación cultural, cierre, palabra seca y claridad.', 'Hierba'],
    ['Laurel', 'victoria, visión, palabra, corona y profecía.', 'Hierba'],
    ['Menta', 'despeje, frescor, mente despierta y circulación.', 'Hierba'],
    ['Albahaca', 'prosperidad doméstica, vínculo, mesa y protección.', 'Hierba'],
    ['Tomillo', 'valor, salud popular, resistencia y fuego pequeño.', 'Hierba'],
    ['Manzanilla', 'calma, dulzura, reposo, digestión simbólica.', 'Hierba'],
    ['Hinojo', 'visión clara, protección popular y fortaleza.', 'Hierba'],
    ['Ortiga', 'defensa, irritación, límite vivo y energía cruda.', 'Hierba'],
    ['Mirra', 'duelo, profundidad, templo, cuerpo y despedida.', 'Resina'],
    ['Incienso', 'elevación, rito, presencia, humo y verticalidad.', 'Resina'],
    ['Copal', 'ofrenda, limpieza, puente ancestral y memoria.', 'Resina'],
    ['Benjuí', 'dulzor, protección, consagración y cierre amable.', 'Resina'],
    ['Obsidiana', 'sombra, corte, espejo, verdad incómoda.', 'Piedra'],
    ['Amatista', 'sueño, templanza, intuición y serenidad.', 'Piedra'],
    ['Cuarzo', 'amplificación, claridad, prisma y enfoque.', 'Piedra'],
    ['Hematita', 'tierra, cuerpo, límite, sangre simbólica.', 'Piedra'],
    ['Labradorita', 'umbral, destello, máscara y protección perceptiva.', 'Piedra'],
    ['Selenita', 'luz lunar, limpieza, fragilidad y canal vertical.', 'Piedra'],
    ['Malaquita', 'cambio, Venus verde, riesgo y transformación.', 'Piedra'],
    ['Jaspe rojo', 'tierra caliente, cuerpo, resistencia y pulso.', 'Piedra'],
    ['Lapislázuli', 'noche real, palabra, autoridad y visión.', 'Piedra'],
    ['Turmalina negra', 'descarga, tierra, defensa y absorción simbólica.', 'Piedra'],
    ['Plata', 'luna, reflejo, receptividad y memoria líquida.', 'Metal'],
    ['Cobre', 'Venus, conducción, vínculo y belleza material.', 'Metal'],
    ['Hierro', 'Marte, defensa, fuerza, herramienta y sangre.', 'Metal'],
    ['Oro', 'sol, centro, soberanía, incorruptibilidad simbólica.', 'Metal'],
    ['Estaño', 'Júpiter, expansión, ley y benevolencia.', 'Metal'],
    ['Plomo', 'Saturno, peso, límite, tiempo y sombra.', 'Metal'],
    ['Mercurio', 'cambio, mente, ambivalencia y mensajero.', 'Metal/Principio'],
    ['Saturno', 'tiempo, límite, estructura, vejez y cosecha.', 'Planeta'],
    ['Júpiter', 'expansión, ley, abundancia, maestro y pacto.', 'Planeta'],
    ['Venus', 'deseo, belleza, alianza, atracción y armonía.', 'Planeta'],
    ['Marte', 'acción, corte, conflicto, valor y defensa.', 'Planeta'],
    ['Mercurio planetario', 'mensaje, comercio, lenguaje, truco y estudio.', 'Planeta'],
    ['Luna', 'sueño, memoria, marea, cuerpo y repetición.', 'Astro'],
    ['Sol', 'claridad, vida, voluntad, centro y revelación.', 'Astro'],
    ['Norte', 'frío, orientación, disciplina y estrella fija.', 'Dirección'],
    ['Sur', 'calor, expansión, deseo y crecimiento.', 'Dirección'],
    ['Este', 'amanecer, aire, inicio y palabra.', 'Dirección'],
    ['Oeste', 'ocaso, agua, cierre y memoria.', 'Dirección'],
    ['Agua', 'emoción, sueño, limpieza, reflejo y adaptación.', 'Elemento'],
    ['Fuego', 'voluntad, purga, energía, impulso y visión.', 'Elemento'],
    ['Aire', 'mente, palabra, movimiento, distancia y signo.', 'Elemento'],
    ['Tierra', 'cuerpo, peso, realidad, alimento y prueba.', 'Elemento']
  ],
  bestiary: [
    ['Basilisco', 'mirada letal y autoridad corrupta; figura de poder que mata al ser observada.', 'Bestiarios medievales'],
    ['Lamia', 'figura ambigua de deseo, pérdida y amenaza nocturna.', 'Mundo grecolatino'],
    ['Kelpie', 'caballo acuático asociado a ríos peligrosos y seducción del abismo.', 'Folclore escocés'],
    ['Banshee', 'presagio sonoro de muerte familiar y linaje en duelo.', 'Folclore irlandés'],
    ['Golem', 'cuerpo artificial animado por palabra, barro y mandato.', 'Tradición judía'],
    ['Ifrit', 'espíritu ígneo poderoso, orgullo, pacto y desierto.', 'Tradición islámica'],
    ['Tengu', 'entidad aérea, marcial, liminal, maestra y peligrosa.', 'Japón'],
    ['Wendigo', 'hambre insaciable, invierno moral y pérdida de humanidad.', 'Tradiciones algonquinas'],
    ['Strigoi', 'retorno inquieto, vampirismo folclórico y muerte mal cerrada.', 'Europa oriental'],
    ['Ahuizotl', 'criatura acuática de manos peligrosas ligada al agua fatal.', 'Tradición mexica'],
    ['Nuckelavee', 'horror marino sin piel, peste, caballo y hombre fusionados.', 'Orcadas'],
    ['Manticora', 'híbrido devorador de frontera y exotismo medieval.', 'Bestiarios'],
    ['Leviatán', 'caos oceánico primordial, monstruo de inmensidad y abismo.', 'Tradición bíblica'],
    ['Djinn', 'voluntad invisible, pacto, ambigüedad y fuego sutil.', 'Oriente Medio'],
    ['Trasgo', 'doméstico, bromista, inquietante; desorden de casa y noche.', 'Folclore ibérico'],
    ['Coco', 'miedo infantil, sombra disciplinaria y pedagogía del terror.', 'Tradición ibérica/latam'],
    ['Moura encantada', 'guardiana de tesoros, fuentes y ruinas con memoria antigua.', 'Península ibérica'],
    ['Santa Compaña', 'procesión nocturna de muertos, aviso y frontera comunitaria.', 'Galicia'],
    ['Dip', 'perro vampírico, camino oscuro y ataque nocturno.', 'Cataluña'],
    ['Pesanta', 'opresión del sueño, criatura sobre el pecho y pesadilla.', 'Cataluña'],
    ['Aloja', 'mujer de agua, cueva, río y belleza peligrosa.', 'Cataluña'],
    ['Hombre del saco', 'figura de rapto, moral doméstica y miedo urbano.', 'Folclore ibérico'],
    ['Kraken', 'monstruo marino, escala imposible y terror de navegación.', 'Norte de Europa'],
    ['Draugr', 'muerto que vuelve, tumba activa y codicia congelada.', 'Nórdico'],
    ['Mare', 'espíritu de pesadilla, presión nocturna y sueño invadido.', 'Germánico'],
    ['Yuki-onna', 'mujer de nieve, belleza letal, frío y silencio.', 'Japón'],
    ['Kappa', 'criatura acuática, reglas, cortesía y peligro fluvial.', 'Japón'],
    ['Pontianak', 'aparición femenina asociada a muerte, perfume y noche.', 'Sudeste asiático'],
    ['Aswang', 'depredador cambiante, miedo comunitario y noche rural.', 'Filipinas'],
    ['Rakshasa', 'ser poderoso, ilusión, hambre y batalla épica.', 'India'],
    ['Naga', 'ser serpentino, agua, tesoro, sabiduría y reino subterráneo.', 'India/Sudeste asiático'],
    ['Qilin', 'presagio benéfico, justicia, pureza y aparición rara.', 'China'],
    ['Jorōgumo', 'araña-mujer, seducción, red y metamorfosis.', 'Japón'],
    ['Chimera', 'mezcla imposible, fuego, desorden taxonómico y amenaza.', 'Grecia'],
    ['Minotauro', 'laberinto, culpa heredada, hambre y centro monstruoso.', 'Grecia'],
    ['Hidra', 'problema que se multiplica al cortarlo sin estrategia.', 'Grecia'],
    ['Sirena', 'voz, atracción, naufragio y conocimiento prohibido.', 'Mediterráneo'],
    ['Grifo', 'custodia, cielo-tierra, tesoro y vigilancia real.', 'Bestiarios'],
    ['Fénix', 'renovación por fuego, ciclo largo y memoria de cenizas.', 'Mitología comparada'],
    ['Garuda', 'ave solar, velocidad, combate contra serpientes y liberación.', 'India'],
    ['Cipactli', 'monstruo primordial, tierra devoradora y origen violento.', 'Mesoamérica'],
    ['Cherufe', 'fuego volcánico, piedra ardiente y montaña viva.', 'Mapuche'],
    ['Yacumama', 'madre de las aguas, serpiente fluvial e inmensidad.', 'Amazonía'],
    ['Tikbalang', 'híbrido caballo-humano, extravío y camino encantado.', 'Filipinas'],
    ['Grootslang', 'elefante-serpiente, cueva, gemas y codicia.', 'Sudáfrica'],
    ['Adze', 'entidad vampírica luminosa, insecto y sospecha nocturna.', 'África occidental']
  ],
  dream: ['agua','casa','puerta','madre','padre','niño','bosque','mar','dientes','sombra','espejo','perro','gato','tren','hospital','iglesia','lluvia','barro','sangre','escuela','ascensor','pozo','llave','ventana','carretera','nieve','pez','pájaro','máscara','libro','teléfono','fuego','ruina','ciudad','habitación','habitaciones','escalera','puente','río','cueva','monte','reloj','calle','hotel','ascensor','puerta','mano','ojo','voz','niña','animal','barco','playa','tormenta','cementerio','teatro','museo','tren','metro','avión','maleta'],
  correspond: [
    ['Lunes', 'Luna, memoria, sueños, familia'], ['Martes', 'Marte, acción, corte, valor'],
    ['Miércoles', 'Mercurio, mensajes, estudio, comercio'], ['Jueves', 'Júpiter, expansión, ley, protección'],
    ['Viernes', 'Venus, belleza, vínculo, deseo'], ['Sábado', 'Saturno, límite, estructura, cierre'],
    ['Domingo', 'Sol, vitalidad, claridad, propósito']
  ],
  ouija: ['ESPERA', 'NO MIRES SOLO UNA PUERTA', 'EL NOMBRE SE REPITE', 'ARCHIVA LA SEÑAL', 'LA RESPUESTA ESTÁ EN EL SUEÑO', 'CIERRA EL CÍRCULO', 'VUELVE CUANDO LA LUNA CAMBIE', 'HAY TRES GOLPES Y UNA LLAVE', 'NO PREGUNTES DOS VECES AL MISMO ECO', 'LA CASA RECUERDA MEJOR QUE TÚ', 'ESCRIBE LA FECHA', 'LA SOMBRA NO ES ENEMIGA: ES ÍNDICE'],
  ritualActs: ['Dibuja un umbral en papel y escribe lo que no debe cruzarlo.', 'Anota tres palabras y tacha una para revelar el núcleo.', 'Abre un libro al azar y roba una imagen para una escena.', 'Cuenta siete respiraciones antes de escribir la respuesta.', 'Deja una vela apagada junto al cuaderno como símbolo de espera.', 'Copia un símbolo y cambia una línea para hacerlo propio.', 'Guarda el resultado en Archivo 404 y no lo releas hasta mañana.']
};

const modules = {
  dashboard() {
    header('Sala principal', 'Elige un libro. Esta edición PRO integra módulos completos, diario paranormal separado, comparador de consultas, archivo exportable y enciclopedias ampliadas.');
    const cards = [
      ['tarot', '✦', 'Libro del Destino', 'Tarot con carta única, tirada de 3, Cruz 404, historial y exportación.'],
      ['ouija', '◉', 'Libro de los Espíritus', 'Tablero narrativo ficticio con sesiones guardadas y acceso al diario paranormal.'],
      ['paranormal', '☉', 'Diario paranormal', 'Registro separado de experiencias, lugares, intensidad, patrones y búsqueda.'],
      ['runas', 'ᚱ', 'Libro de las Runas', 'Elder Futhark completo, tiradas, significados e historial.'],
      ['iching', '☯', 'Libro de los Hexagramas', 'Monedas virtuales, líneas mutables, hexagrama y comparación posterior.'],
      ['suenos', '☾', 'Libro de los Sueños', 'Diario, calendario, símbolos recurrentes, estadísticas y exportación.'],
      ['luna', '☽', 'Libro Lunar', 'Calendario perpetuo mes a mes, fase diaria, hitos y correspondencias.'],
      ['grimorio', '✧', 'Grimorio', 'Enciclopedia ampliada de hierbas, piedras, metales, planetas, elementos y direcciones.'],
      ['bestiario', '♆', 'Bestiario Prohibido', 'Folclore mundial en clave cultural e histórica, con buscador.'],
      ['simbolos', '☍', 'Codex Symbolorum', 'Alquimia, astrología, sigilos, árbol de la vida y simbología comparada.'],
      ['rituales', '🕯', 'Ritual Generator', 'Rituales ficticios para narrativa, rol y atmósfera sin afirmar efectos reales.'],
      ['consulta', '◆', 'Consulta rápida', 'Combina tarot, runa, símbolo, luna y correspondencia diaria.'],
      ['comparador', '◇', 'Comparador', 'Compara dos consultas o las dos últimas por tipo para detectar repeticiones y evolución.'],
      ['archivo', '▣', 'Archivo 404', 'Historial visible, búsqueda, borrado selectivo, backup e importación segura.'],
      ['audio', '♬', 'Cámara de Ecos', 'Ambientes sonoros procedurales: biblioteca, lluvia, bosque, templo, mar, viento y cósmico.']
    ];
    panel.innerHTML += `<div class="grid library">${cards.map(c => `<article class="card" data-open="${c[0]}"><span class="icon">${c[1]}</span><h3>${esc(c[2])}</h3><p>${esc(c[3])}</p></article>`).join('')}</div>${projectNotice()}`;
  },
  tarot() {
    header('Libro del Destino', 'Tarot simbólico con tiradas guardadas en Archivo 404. Incluye exportación general desde el archivo y comparación entre lecturas.');
    panel.innerHTML += `<div class="controls"><button class="primary" data-act="tarot1">Carta única</button><button class="secondary" data-act="tarot3">Tirada de 3</button><button class="secondary" data-act="tarot5">Cruz 404</button><button class="secondary" data-act="compareTarot">Comparar últimas de Tarot</button></div><div id="out"></div>`;
  },
  ouija() {
    header('Libro de los Espíritus', 'Tablero narrativo ficticio. No afirma comunicación real: genera respuestas atmosféricas para juego, escritura y exploración simbólica.');
    panel.innerHTML += `<label>Pregunta</label><input class="input" id="q" maxlength="180" placeholder="Escribe una pregunta simbólica"><div class="controls"><button class="primary" data-act="ouija">Consultar tablero</button><button class="secondary" data-open="paranormal">Abrir diario paranormal</button></div><div id="out"></div>${projectNotice()}`;
  },
  paranormal() {
    header('Diario paranormal', 'Registro privado separado para experiencias, sesiones, lugares, intensidad, patrones y notas. Todo queda en este navegador.');
    const log = store.get('paranormal', []);
    const top = topWords(log.map(x => `${x.title} ${x.body} ${x.place} ${x.tags?.join(' ') || ''}`).join(' '), 6);
    panel.innerHTML += `
      <div class="stats"><div class="stat"><strong>${log.length}</strong><span>registros</span></div><div class="stat"><strong>${avgIntensity(log)}</strong><span>intensidad media</span></div><div class="stat"><strong>${esc(top[0] || '—')}</strong><span>patrón frecuente</span></div><div class="stat"><strong>${paranormalThisMonth(log)}</strong><span>este mes</span></div></div>
      <label>Título</label><input class="input" id="paraTitle" maxlength="90" placeholder="Ej. Tres golpes en la pared">
      <label>Lugar</label><input class="input" id="paraPlace" maxlength="90" placeholder="Ej. Pasillo, dormitorio, casa antigua">
      <label>Tipo</label><select id="paraType"><option>Ruido</option><option>Sueño lúcido</option><option>Presencia</option><option>Sincronicidad</option><option>Objeto movido</option><option>Sesión Ouija ficticia</option><option>Otro</option></select>
      <label>Intensidad: <span id="intensityLabel">5</span>/10</label><input class="slider" id="paraIntensity" type="range" min="1" max="10" value="5">
      <label>Notas</label><textarea id="paraBody" maxlength="2200" placeholder="Describe hora, sensación, contexto, testigos, símbolos, y qué pasó después..."></textarea>
      <label>Etiquetas separadas por coma</label><input class="input" id="paraTags" maxlength="120" placeholder="lluvia, sombra, golpes, espejo">
      <div class="controls"><button class="primary" data-act="saveParanormal">Guardar registro</button><button class="secondary" data-act="exportParanormal">Exportar diario</button></div>
      <div class="searchrow"><label>Buscar en diario paranormal<input class="input" id="paraSearch" placeholder="lugar, etiqueta, símbolo..."></label><button class="primary" data-act="searchParanormal">Buscar</button></div>
      <h3>Registros</h3><div id="paranormalList">${paranormalHTML(log)}</div>`;
    $('#paraIntensity')?.addEventListener('input', e => $('#intensityLabel').textContent = e.target.value);
  },
  runas() {
    header('Libro de las Runas', 'Elder Futhark completo con tirada de una runa, tres runas y archivo consultable.');
    panel.innerHTML += `<div class="controls"><button class="primary" data-act="rune1">Una runa</button><button class="secondary" data-act="rune3">Tres runas</button><button class="secondary" data-act="runeAll">Ver Futhark completo</button><button class="secondary" data-act="compareRunas">Comparar últimas runas</button></div><div id="out"></div>`;
  },
  iching() {
    header('Libro de los Hexagramas', 'Lanza seis líneas con monedas virtuales. Las líneas 6 y 9 quedan marcadas como mutables y se guardan para comparar consultas.');
    panel.innerHTML += `<div class="controls"><button class="primary" data-act="iching">Lanzar monedas</button><button class="secondary" data-act="compareIChing">Comparar últimos hexagramas</button></div><div id="out"></div>`;
  },
  suenos() {
    header('Libro de los Sueños', 'Diario local con calendario, símbolos recurrentes, estadísticas y exportación.');
    const dreams = store.get('dreams', []);
    panel.innerHTML += `
      <label>Título</label><input class="input" id="dreamTitle" maxlength="90" placeholder="Ej. La casa bajo la lluvia">
      <label>Sueño</label><textarea id="dreamBody" maxlength="2600" placeholder="Describe imágenes, emociones, lugares y símbolos..."></textarea>
      <div class="controls"><button class="primary" data-act="saveDream">Guardar sueño</button><button class="secondary" data-act="exportDreams">Exportar sueños</button></div>
      <div class="stats"><div class="stat"><strong>${dreams.length}</strong><span>sueños</span></div><div class="stat"><strong>${esc(topDream(dreams) || '—')}</strong><span>símbolo frecuente</span></div><div class="stat"><strong>${avgWords(dreams)}</strong><span>palabras/media</span></div><div class="stat"><strong>${dreamsThisMonth(dreams)}</strong><span>este mes</span></div></div>
      <div class="calendar">${dreamCal(dreams, new Date())}</div>
      <h3>Registros</h3><div id="dreamList">${dreams.map(d => entryHTML(d, 'dream')).join('') || card('Sin sueños guardados', 'Empieza registrando un sueño.', 'Diario')}</div>`;
  },
  luna() {
    header('Libro Lunar', 'Calendario lunar perpetuo con navegación mes a mes, hitos aproximados, correspondencias y vista anual resumida.');
    const y = store.get('moonY', new Date().getFullYear());
    const m = store.get('moonM', new Date().getMonth());
    const date = new Date(y, m, 1);
    const today = new Date();
    const phase = getMoonPhase(today);
    panel.innerHTML += `
      <div class="result"><span class="badge">Hoy</span><h3>${phase.emoji} ${esc(phase.name)}</h3><p>${esc(phase.tip)} Correspondencia diaria: ${esc(dayCorrespondence())}.</p></div>
      <div class="controls"><button class="secondary" data-act="moonPrev">Mes anterior</button><button class="secondary" data-act="moonToday">Hoy</button><button class="secondary" data-act="moonNext">Mes siguiente</button><button class="secondary" data-act="moonYear">Vista anual</button></div>
      <div class="calendar">${moonCal(date)}</div>
      <h3>Próximos hitos lunares aproximados</h3><div class="grid">${moonEvents(today).map(e => `<article class="card"><span class="badge">${esc(e.badge)}</span><h3>${esc(e.title)}</h3><p>${esc(e.date)}</p></article>`).join('')}</div>
      <div id="yearView"></div>`;
  },
  grimorio() { renderEncyclopedia('Grimorio', 'Hierbas, piedras, metales, planetas, astros, elementos y direcciones en formato enciclopedia buscable.', data.grimoire); },
  bestiario() { renderEncyclopedia('Bestiario Prohibido', 'Folclore mundial presentado como archivo cultural e histórico, no como afirmación literal.', data.bestiary); },
  simbolos() { renderEncyclopedia('Codex Symbolorum', 'Alquimia, astrología, sigilos, árbol de la vida, símbolos comparados e iconografía ritual.', data.symbols); },
  rituales() {
    header('Ritual Generator', 'Generador de rituales ficticios para escritura, rol, ambientación y creatividad. No afirma producir efectos reales.');
    panel.innerHTML += `<label>Intención narrativa</label><input class="input" id="intent" maxlength="90" placeholder="Ej. desbloquear una escena, crear tensión, cerrar un capítulo"><div class="controls"><button class="primary" data-act="ritual">Generar ritual ficticio</button></div><div id="out"></div>${projectNotice()}`;
  },
  consulta() {
    header('Consulta rápida', 'Lectura combinada que cruza tarot, runa, símbolo, luna y correspondencia diaria. Ideal para obtener una clave creativa inmediata.');
    panel.innerHTML += `<label>Pregunta o tema</label><input class="input" id="quickQ" maxlength="160" placeholder="Ej. ¿Qué debo ordenar ahora?"><div class="controls"><button class="primary" data-act="quick">Hacer consulta</button></div><div id="out"></div>`;
  },
  comparador() {
    header('Comparador de consultas', 'Compara dos lecturas del Archivo 404 o las dos últimas de Tarot, Runas o I Ching. Detecta repeticiones, símbolos comunes y evolución.');
    const entries = comparableEntries();
    panel.innerHTML += `
      <div class="controls"><button class="secondary" data-act="compareLast">Comparar dos últimas</button><button class="secondary" data-act="compareTarot">Tarot</button><button class="secondary" data-act="compareRunas">Runas</button><button class="secondary" data-act="compareIChing">I Ching</button></div>
      <div class="searchrow"><label>Consulta A<select id="cmpA">${compareOptions(entries, 0)}</select></label><label>Consulta B<select id="cmpB">${compareOptions(entries, 1)}</select></label></div>
      <div class="controls"><button class="primary" data-act="compareSelected">Comparar selección</button></div>
      <div id="compareOut">${entries.length < 2 ? card('Faltan consultas', 'Haz al menos dos tiradas o consultas para activar el comparador.', 'Comparador') : ''}</div>`;
  },
  archivo() {
    header('Archivo 404', 'Historial visible, búsqueda, borrado selectivo, exportación JSON/TXT e importación de backup.');
    const entries = store.get('entries', []);
    const dreams = store.get('dreams', []);
    const paranormal = store.get('paranormal', []);
    panel.innerHTML += `
      <div class="stats"><div class="stat"><strong>${entries.length}</strong><span>lecturas</span></div><div class="stat"><strong>${dreams.length}</strong><span>sueños</span></div><div class="stat"><strong>${paranormal.length}</strong><span>paranormal</span></div><div class="stat"><strong>${entries.filter(e => e.type === 'I Ching').length}</strong><span>I Ching</span></div></div>
      <div class="searchrow"><label>Buscar en archivo<input class="input" id="search" placeholder="tarot, luna, símbolo, entidad..."></label><button class="primary" data-act="searchArchive">Buscar</button></div>
      <div class="controls"><button class="secondary" data-act="exportJSON">Exportar JSON</button><button class="secondary" data-act="exportTXT">Exportar TXT</button><button class="secondary" data-act="importBackup">Importar backup</button><button class="tiny danger" data-act="clearAll">Borrar todo</button></div>
      <input id="backupFile" type="file" accept="application/json" hidden>
      <h3>Lecturas y consultas</h3><div id="archiveList">${archiveHTML(entries)}</div>`;
  },
  audio() {
    header('Cámara de Ecos', 'Ambiente sonoro procedural generado en el navegador. No usa archivos externos ni material con copyright.');
    const preset = store.get('preset', 'biblioteca');
    const volume = store.get('vol', 0.1);
    panel.innerHTML += `<label>Ambiente</label><select id="preset">${Object.entries(audioPresets).map(([key, value]) => `<option value="${esc(key)}" ${key === preset ? 'selected' : ''}>${esc(value.label)} — ${esc(value.desc)}</option>`).join('')}</select><label>Volumen</label><input class="slider" id="vol" type="range" min="0" max="0.35" step="0.01" value="${esc(volume)}"><div class="controls"><button class="primary" data-act="playAudio">Activar ambiente</button><button class="secondary" data-act="stopAudio">Detener</button></div><p class="notice">El volumen se guarda localmente. En móvil, el audio solo puede iniciarse tras tocar un botón por seguridad del navegador.</p>`;
    $('#preset').addEventListener('change', e => { store.set('preset', e.target.value); if (audioCtx) startAudio(); });
    $('#vol').addEventListener('input', e => { const v = Number(e.target.value); store.set('vol', v); if (gain) gain.gain.value = v; });
  },
  ajustes() {
    header('Ajustes y privacidad', 'Control local de datos. Arcanum 404 no usa servidor, cuentas, cookies externas ni APIs.');
    panel.innerHTML += `<div class="grid"><article class="card"><h3>Privacidad</h3><p>Todo se guarda en localStorage de este navegador. Nadie recibe tus sueños, sesiones o notas.</p></article><article class="card"><h3>Backup</h3><p>Exporta JSON desde Archivo 404 antes de limpiar navegador o cambiar de dispositivo.</p></article><article class="card"><h3>Uso responsable</h3><p>Es una herramienta cultural, simbólica, creativa y de entretenimiento. No sustituye ayuda profesional.</p></article></div><div class="controls"><button class="secondary" data-act="exportJSON">Exportar todo</button><button class="tiny danger" data-act="clearAll">Borrar datos locales</button></div>`;
  }
};

function projectNotice() {
  return `<div class="notice"><strong>Aviso:</strong> herramienta simbólica, cultural, creativa y de entretenimiento. No sustituye consejo médico, legal, financiero ni psicológico, ni afirma resultados sobrenaturales reales.</div>`;
}

function renderEncyclopedia(title, description, list) {
  header(title, description);
  const categories = [...new Set(list.map(item => item[2]))].sort((a, b) => a.localeCompare(b, 'es'));
  panel.dataset.ency = JSON.stringify(list);
  panel.innerHTML += `<div class="stats"><div class="stat"><strong>${list.length}</strong><span>entradas</span></div><div class="stat"><strong>${categories.length}</strong><span>categorías</span></div><div class="stat"><strong>${esc(categories[0] || '—')}</strong><span>primera categoría</span></div><div class="stat"><strong>Offline</strong><span>sin red</span></div></div><div class="searchrow"><label>Buscar<input class="input" id="encySearch" placeholder="agua, hierro, serpiente, umbral..."></label><button class="primary" data-act="filterEncy">Buscar</button></div><div class="pillbox">${categories.map(c => `<button class="tiny" data-act="encyCategory" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="ency" class="grid">${list.map(miniCard).join('')}</div>`;
}

function tarotDraw(count, spread) {
  const deck = [...data.tarot].sort(() => Math.random() - 0.5).slice(0, count);
  const body = deck.map((cardData, index) => `${spread[index] || `Posición ${index + 1}`}: ${cardData[0]} — ${cardData[1]}. ${cardData[2]}`).join(' ');
  $('#out').innerHTML = `<div class="results">${deck.map((cardData, index) => card(`${spread[index] || `Posición ${index + 1}`}: ${cardData[0]}`, `${cardData[1]}. ${cardData[2]}`, 'Tarot')).join('')}</div>`;
  saveEntry('Tarot', count === 1 ? 'Carta única' : count === 3 ? 'Tirada de 3' : 'Cruz 404', body, { cards: deck.map(x => x[0]), tags: deck.map(x => x[0]) });
}

function runeDraw(count) {
  const runes = [...data.runes].sort(() => Math.random() - 0.5).slice(0, count);
  const labels = count === 1 ? ['Clave'] : ['Raíz', 'Tensión', 'Consejo'];
  const body = runes.map((r, index) => `${labels[index]}: ${r[0]} — ${r[1]}`).join(' ');
  $('#out').innerHTML = `<div class="results">${runes.map((r, index) => card(`${labels[index]}: ${r[0]}`, r[1], 'Runa')).join('')}</div>`;
  saveEntry('Runas', count === 1 ? 'Una runa' : 'Tirada de tres runas', body, { runes: runes.map(x => x[0]), tags: runes.map(x => x[0]) });
}

function ouija() {
  const question = clampText($('#q')?.value, 180) || 'sin pregunta';
  const answer = rnd(data.ouija);
  const body = `Pregunta: ${question}. Mensaje: ${answer}.`;
  $('#out').innerHTML = card('Respuesta del tablero', body, 'Ouija ficticia');
  saveEntry('Ouija', question, answer, { tags: ['ouija', 'espíritus', 'ficticio'] });
}

function iching() {
  const lines = Array.from({ length: 6 }, () => [2, 3, 2].map(() => Math.random() < 0.5 ? 2 : 3).reduce((a, b) => a + b, 0));
  const hex = hexNumber(lines);
  const mutable = lines.map((v, index) => (v === 6 || v === 9) ? index + 1 : null).filter(Boolean);
  const html = lines.slice().reverse().map((value, index) => {
    const yin = value === 6 || value === 8;
    const moving = value === 6 || value === 9;
    return `<tr><td>${6 - index}</td><td>${yin ? '⚋ ⚋' : '━━━━'}</td><td>${value}</td><td>${moving ? 'mutable' : 'fija'}</td></tr>`;
  }).join('');
  const body = `Hexagrama estimado ${hex}. Líneas: ${lines.join(', ')}. Mutables: ${mutable.length ? mutable.join(', ') : 'ninguna'}. Consejo: ${hexAdvice(hex)}.`;
  $('#out').innerHTML = `<article class="result"><span class="badge">I Ching</span><h3>Hexagrama ${hex}</h3><p>${esc(hexAdvice(hex))}</p><table class="table"><thead><tr><th>Línea</th><th>Forma</th><th>Suma</th><th>Estado</th></tr></thead><tbody>${html}</tbody></table></article>`;
  saveEntry('I Ching', `Hexagrama ${hex}`, body, { lines, hexagram: hex, mutable, tags: [`Hexagrama ${hex}`, ...mutable.map(x => `Línea ${x}`)] });
}

function hexNumber(lines) {
  const binary = lines.map(v => (v === 6 || v === 8) ? 0 : 1).join('');
  const n = parseInt(binary, 2) + 1;
  return ((n - 1) % 64) + 1;
}

function hexAdvice(n) {
  const advices = ['Inicia con humildad.', 'Acepta la receptividad.', 'Ordena el caos inicial.', 'Aprende antes de avanzar.', 'Espera el momento fértil.', 'Evita el choque frontal.', 'Organiza aliados.', 'Observa la unión.', 'Pequeños ajustes sostienen grandes cambios.', 'Pisa con cuidado.', 'Hay paz si cada parte ocupa su lugar.', 'El bloqueo pide paciencia.', 'Busca comunidad.', 'La riqueza exige responsabilidad.', 'La modestia abre puertas.', 'La energía debe conducirse.', 'Sigue sin forzar.', 'Repara lo antiguo.', 'Acércate con atención.', 'Contempla antes de actuar.'];
  return advices[(n - 1) % advices.length];
}

function saveDream() {
  const title = clampText($('#dreamTitle')?.value, 90) || 'Sueño sin título';
  const body = clampText($('#dreamBody')?.value, 2600);
  if (!body) { $('#dreamBody')?.focus(); return; }
  const dreams = store.get('dreams', []);
  const tags = findKnownSymbols(body, data.dream).slice(0, 8);
  const dream = { id: uid(), title, body, date: nowText(), iso: todayISO(), type: 'Sueño', tags };
  dreams.unshift(dream);
  store.set('dreams', dreams.slice(0, 800));
  saveEntry('Sueño', title, body, { tags });
  modules.suenos();
}

function topDream(dreams) {
  const text = dreams.map(d => d.body.toLowerCase()).join(' ');
  return data.dream.map(symbol => [symbol, countWord(text, symbol)]).filter(x => x[1]).sort((a, b) => b[1] - a[1])[0]?.[0];
}
function avgWords(items) { return items.length ? Math.round(items.reduce((sum, item) => sum + item.body.split(/\s+/).filter(Boolean).length, 0) / items.length) : 0; }
function dreamsThisMonth(dreams) { const n = new Date(); return dreams.filter(d => sameMonth(new Date(d.iso), n)).length; }

function dreamCal(dreams, date) {
  const y = date.getFullYear(), m = date.getMonth(), first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
  const marks = new Set(dreams.map(d => new Date(d.iso)).filter(d => d.getFullYear() === y && d.getMonth() === m).map(d => d.getDate()));
  let html = `<div class="cal-title"><span>${esc(date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }))}</span></div>`;
  ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(day => html += `<span class="cal-head">${day}</span>`);
  for (let i = 0; i < (first.getDay() + 6) % 7; i++) html += '<span></span>';
  for (let d = 1; d <= days; d++) html += `<span class="cal-day ${marks.has(d) ? 'marked' : ''}">${d}${marks.has(d) ? '<small>✦</small>' : ''}</span>`;
  return html;
}

function saveParanormal() {
  const title = clampText($('#paraTitle')?.value, 90) || 'Registro sin título';
  const place = clampText($('#paraPlace')?.value, 90) || 'Lugar no indicado';
  const type = clampText($('#paraType')?.value, 60) || 'Otro';
  const intensity = Number($('#paraIntensity')?.value || 5);
  const body = clampText($('#paraBody')?.value, 2200);
  const tags = clampText($('#paraTags')?.value, 120).split(',').map(x => x.trim()).filter(Boolean).slice(0, 10);
  if (!body) { $('#paraBody')?.focus(); return; }
  const log = store.get('paranormal', []);
  const item = { id: uid(), title, place, type, intensity, body, tags, date: nowText(), iso: todayISO() };
  log.unshift(item);
  store.set('paranormal', log.slice(0, 800));
  saveEntry('Paranormal', `${title} · ${place}`, `${type}. Intensidad ${intensity}/10. ${body}`, { tags: ['paranormal', type, ...tags] });
  modules.paranormal();
}
function paranormalHTML(log) { return log.map(x => entryHTML({ ...x, title: `${x.title} · ${x.place}`, body: `${x.type}. Intensidad ${x.intensity}/10. ${x.body}`, type: 'Paranormal' }, 'paranormal')).join('') || card('Diario vacío', 'Guarda una experiencia para empezar a detectar patrones.', 'Paranormal'); }
function avgIntensity(log) { return log.length ? (log.reduce((s, x) => s + Number(x.intensity || 0), 0) / log.length).toFixed(1) : '—'; }
function paranormalThisMonth(log) { const n = new Date(); return log.filter(x => sameMonth(new Date(x.iso), n)).length; }

function getMoonPhase(date) {
  const lunarPeriod = 2551443;
  const seconds = date.getTime() / 1000;
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime() / 1000;
  const phase = ((seconds - knownNewMoon) % lunarPeriod + lunarPeriod) % lunarPeriod / lunarPeriod;
  const phases = [
    ['Luna nueva', '🌑', 'inicio', 'Formula intención y limpia prioridades.'],
    ['Creciente', '🌒', 'siembra', 'Desarrolla una idea y observa señales.'],
    ['Cuarto creciente', '🌓', 'decisión', 'Elige una puerta y actúa.'],
    ['Gibosa creciente', '🌔', 'ajuste', 'Corrige, pule y compara patrones.'],
    ['Luna llena', '🌕', 'revelación', 'Registra sueños: lo oculto se vuelve narrativo.'],
    ['Gibosa menguante', '🌖', 'digestión', 'Integra sin precipitar conclusiones.'],
    ['Cuarto menguante', '🌗', 'corte', 'Elimina ruido y cargas inútiles.'],
    ['Menguante', '🌘', 'cierre', 'Archiva aprendizajes y descansa.']
  ];
  const index = Math.floor(phase * 8) % 8;
  return { index, name: phases[index][0], emoji: phases[index][1], energy: phases[index][2], tip: phases[index][3] };
}

function moonCal(date) {
  const y = date.getFullYear(), m = date.getMonth(), first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), today = new Date();
  let html = `<div class="cal-title"><span>${esc(date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }))}</span></div>`;
  ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(day => html += `<span class="cal-head">${day}</span>`);
  for (let i = 0; i < (first.getDay() + 6) % 7; i++) html += '<span></span>';
  for (let d = 1; d <= days; d++) {
    const phase = getMoonPhase(new Date(y, m, d));
    const cls = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d ? 'today' : '';
    html += `<span class="cal-day ${cls}" title="${esc(phase.name)}">${d}<small>${phase.emoji}</small></span>`;
  }
  return html;
}
function moonEvents(date) {
  const targets = { 0: 'Luna nueva', 2: 'Cuarto creciente', 4: 'Luna llena', 6: 'Cuarto menguante' };
  const seen = new Set(), out = [];
  for (let i = 0; i < 90 && out.length < 6; i++) {
    const d = new Date(date); d.setDate(date.getDate() + i);
    const phase = getMoonPhase(d);
    if (targets[phase.index] && !seen.has(`${phase.index}-${d.getMonth()}-${d.getDate()}`)) {
      seen.add(`${phase.index}-${d.getMonth()}-${d.getDate()}`);
      out.push({ badge: 'Evento lunar', title: targets[phase.index], date: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) });
    }
  }
  return out;
}
function renderYearView() {
  const year = store.get('moonY', new Date().getFullYear());
  const solstices = [
    ['Equinoccio de marzo', `20 de marzo de ${year}`, 'Equilibrio entre luz y sombra.'],
    ['Solsticio de junio', `21 de junio de ${year}`, 'Máxima luz simbólica.'],
    ['Equinoccio de septiembre', `22 de septiembre de ${year}`, 'Cosecha y compensación.'],
    ['Solsticio de diciembre', `21 de diciembre de ${year}`, 'Noche larga e interioridad.']
  ];
  $('#yearView').innerHTML = `<h3>Vista anual simbólica ${year}</h3><div class="grid">${solstices.map(x => `<article class="card"><span class="badge">Hito solar</span><h3>${esc(x[0])}</h3><p>${esc(x[1])}. ${esc(x[2])}</p></article>`).join('')}</div>`;
}
function dayCorrespondence() { return data.correspond[(new Date().getDay() + 6) % 7][1].split(',')[0]; }

const audioPresets = {
  biblioteca: { label: 'Biblioteca antigua', desc: 'Zumbido grave y respiración de sala vacía.', freqs: [55, 110, 220], type: 'sine', pulse: 0.05 },
  lluvia: { label: 'Lluvia', desc: 'Textura ondulante similar a lluvia lejana.', freqs: [80, 122, 244], type: 'triangle', pulse: 0.13 },
  bosque: { label: 'Bosque nocturno', desc: 'Capas lentas y orgánicas.', freqs: [64, 96, 192], type: 'sine', pulse: 0.09 },
  templo: { label: 'Templo', desc: 'Dron ceremonial y profundo.', freqs: [48, 96, 144], type: 'sine', pulse: 0.03 },
  mar: { label: 'Mar', desc: 'Oleaje grave y cíclico.', freqs: [44, 88, 176], type: 'triangle', pulse: 0.06 },
  viento: { label: 'Viento', desc: 'Oscilación fría y ligera.', freqs: [120, 240, 360], type: 'sine', pulse: 0.18 },
  cosmico: { label: 'Cósmico', desc: 'Dron espacial y distante.', freqs: [39, 78, 156, 312], type: 'sawtooth', pulse: 0.04 }
};
let audioCtx, gain, osc = [], lfo = [];
function startAudio() {
  stopAudio();
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;
  audioCtx = new AudioEngine();
  gain = audioCtx.createGain();
  gain.gain.value = Number(store.get('vol', 0.10));
  gain.connect(audioCtx.destination);
  const preset = audioPresets[store.get('preset', 'biblioteca')] || audioPresets.biblioteca;
  preset.freqs.forEach((freq, index) => {
    const oscillator = audioCtx.createOscillator();
    const voiceGain = audioCtx.createGain();
    const lfoOsc = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    oscillator.type = preset.type;
    oscillator.frequency.value = freq;
    voiceGain.gain.value = 0.055 / (index + 1);
    lfoOsc.frequency.value = preset.pulse * (index + 1);
    lfoGain.gain.value = 0.025;
    lfoOsc.connect(lfoGain); lfoGain.connect(voiceGain.gain);
    oscillator.connect(voiceGain); voiceGain.connect(gain);
    oscillator.start(); lfoOsc.start();
    osc.push(oscillator); lfo.push(lfoOsc);
  });
}
function stopAudio() { [...osc, ...lfo].forEach(node => { try { node.stop(); } catch {} }); osc = []; lfo = []; if (audioCtx) { audioCtx.close(); audioCtx = null; } }

function ritual() {
  const intent = clampText($('#intent')?.value, 90) || 'abrir una escena';
  const herb = rnd(data.grimoire), symbol = rnd(data.symbols), beast = rnd(data.bestiary), moon = getMoonPhase(new Date()), act = rnd(data.ritualActs);
  const body = `Intención: ${intent}. Fase: ${moon.name}. Correspondencia: ${herb[0]} (${herb[1]}). Símbolo: ${symbol[0]} (${symbol[1]}). Bestiario de apoyo: ${beast[0]} (${beast[1]}). Acto ficticio: ${act}`;
  $('#out').innerHTML = card('Ritual narrativo 404', body, 'Ficción');
  saveEntry('Ritual', intent, body, { tags: ['ritual', herb[0], symbol[0], beast[0], moon.name] });
}
function quick() {
  const q = clampText($('#quickQ')?.value, 160) || 'consulta rápida';
  const t = rnd(data.tarot), r = rnd(data.runes), s = rnd(data.symbols), m = getMoonPhase(new Date()), g = rnd(data.grimoire);
  const body = `Pregunta: ${q}. Tarot: ${t[0]} — ${t[1]}. Runa: ${r[0]} — ${r[1]}. Símbolo: ${s[0]} — ${s[1]}. Grimorio: ${g[0]} — ${g[1]}. Luna: ${m.name} — ${m.tip}`;
  $('#out').innerHTML = card('Lectura combinada', body, 'Consulta');
  saveEntry('Consulta', q, body, { tags: [t[0], r[0], s[0], g[0], m.name] });
}
function filterEncy(category = null) {
  const q = ($('#encySearch')?.value || '').toLowerCase().trim();
  const list = JSON.parse(panel.dataset.ency || '[]');
  const filtered = list.filter(item => (!category || item[2] === category) && item.join(' ').toLowerCase().includes(q));
  $('#ency').innerHTML = filtered.map(miniCard).join('') || card('Sin resultados', 'Prueba con otro término o limpia la búsqueda.', 'Búsqueda');
}

function exportJSON() {
  download('arcanum404-backup-v2.1.0.json', JSON.stringify({
    entries: store.get('entries', []), dreams: store.get('dreams', []), paranormal: store.get('paranormal', []),
    settings: { preset: store.get('preset', 'biblioteca'), vol: store.get('vol', 0.1) }, exportedAt: todayISO(), version: VERSION
  }, null, 2), 'application/json');
}
function exportTXT() {
  const entries = store.get('entries', []).map(e => `[${e.type}] ${e.date}\n${e.title}\n${e.body}`).join('\n\n---\n\n');
  const dreams = store.get('dreams', []).map(d => `[Sueño] ${d.date}\n${d.title}\n${d.body}`).join('\n\n---\n\n');
  const paranormal = store.get('paranormal', []).map(p => `[Paranormal] ${p.date}\n${p.title} · ${p.place}\n${p.type} · Intensidad ${p.intensity}/10\n${p.body}`).join('\n\n---\n\n');
  download('arcanum404-archivo-v2.1.0.txt', `ARCANUM 404 v2.1.0\n\nLECTURAS\n\n${entries}\n\nSUEÑOS\n\n${dreams}\n\nDIARIO PARANORMAL\n\n${paranormal}`);
}
function exportDreams() { download('arcanum404-suenos.json', JSON.stringify(store.get('dreams', []), null, 2), 'application/json'); }
function exportParanormal() { download('arcanum404-diario-paranormal.json', JSON.stringify(store.get('paranormal', []), null, 2), 'application/json'); }
function importBackup() { $('#backupFile')?.click(); }
function handleBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result);
      if (Array.isArray(backup.entries)) store.set('entries', backup.entries.slice(0, 1200));
      if (Array.isArray(backup.dreams)) store.set('dreams', backup.dreams.slice(0, 800));
      if (Array.isArray(backup.paranormal)) store.set('paranormal', backup.paranormal.slice(0, 800));
      modules.archivo();
    } catch { alert('Backup no válido.'); }
  };
  reader.readAsText(file);
}

function archiveHTML(entries) { return entries.map(e => entryHTML(e, 'entry')).join('') || card('Archivo vacío', 'Haz una consulta o tirada para empezar.', 'Archivo'); }
function comparableEntries() { return store.get('entries', []).filter(e => ['Tarot', 'Runas', 'I Ching', 'Consulta', 'Ouija', 'Ritual', 'Paranormal'].includes(e.type)); }
function compareOptions(entries, selectedIndex) {
  return entries.map((e, index) => `<option value="${esc(e.id)}" ${index === selectedIndex ? 'selected' : ''}>${esc(`${e.type} · ${e.date} · ${e.title}`)}</option>`).join('');
}
function compareByType(type) {
  const entries = comparableEntries().filter(e => e.type === type);
  if (entries.length < 2) { showCompare(card(`Faltan consultas de ${type}`, 'Necesitas al menos dos registros de este tipo.', 'Comparador')); return; }
  showCompare(compareHTML(entries[0], entries[1]));
}
function compareSelected() {
  const entries = comparableEntries();
  const a = entries.find(e => e.id === $('#cmpA')?.value);
  const b = entries.find(e => e.id === $('#cmpB')?.value);
  if (!a || !b || a.id === b.id) { showCompare(card('Selección no válida', 'Elige dos consultas diferentes.', 'Comparador')); return; }
  showCompare(compareHTML(a, b));
}
function compareLast() {
  const entries = comparableEntries();
  if (entries.length < 2) { showCompare(card('Faltan consultas', 'Necesitas al menos dos registros.', 'Comparador')); return; }
  showCompare(compareHTML(entries[0], entries[1]));
}
function showCompare(html) { const target = $('#compareOut') || $('#out'); if (target) target.innerHTML = html; else panel.innerHTML += html; }
function compareHTML(a, b) {
  const textA = `${a.title} ${a.body} ${(a.tags || []).join(' ')}`;
  const textB = `${b.title} ${b.body} ${(b.tags || []).join(' ')}`;
  const wordsA = keywords(textA), wordsB = keywords(textB);
  const common = wordsA.filter(w => wordsB.includes(w)).slice(0, 12);
  const onlyA = wordsA.filter(w => !wordsB.includes(w)).slice(0, 8);
  const onlyB = wordsB.filter(w => !wordsA.includes(w)).slice(0, 8);
  const intensity = common.length >= 6 ? 'Alta repetición simbólica' : common.length >= 3 ? 'Evolución con ecos claros' : 'Lecturas bastante diferentes';
  return `<article class="result"><span class="badge">Comparador</span><h3>${esc(intensity)}</h3><p><strong>A:</strong> ${esc(a.type)} · ${esc(a.date)} · ${esc(a.title)}</p><p><strong>B:</strong> ${esc(b.type)} · ${esc(b.date)} · ${esc(b.title)}</p><div class="grid"><article class="card"><h3>Coincidencias</h3><p>${esc(common.join(', ') || 'Sin coincidencias fuertes.')}</p></article><article class="card"><h3>Solo A</h3><p>${esc(onlyA.join(', ') || '—')}</p></article><article class="card"><h3>Solo B</h3><p>${esc(onlyB.join(', ') || '—')}</p></article></div></article>`;
}

function keywords(text) {
  const stop = new Set('para porque como una unos unas esta este esto los las del que con sin por sobre entre desde hasta pregunta mensaje tarot runas consulta ritual ficticio intensidad línea lineas hexagrama'.split(' '));
  return [...new Set(String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stop.has(w)))];
}
function topWords(text, limit = 5) { return keywords(text).map(w => [w, countWord(text.toLowerCase(), w)]).sort((a, b) => b[1] - a[1]).slice(0, limit).map(x => x[0]); }
function countWord(text, word) { return (String(text).toLowerCase().match(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length; }
function findKnownSymbols(text, symbols) { const low = String(text).toLowerCase(); return symbols.filter(s => low.includes(s.toLowerCase())); }
function sameMonth(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); }

function routeAct(action, target) {
  if (action === 'tarot1') tarotDraw(1, ['Clave']);
  if (action === 'tarot3') tarotDraw(3, ['Pasado', 'Presente', 'Umbral']);
  if (action === 'tarot5') tarotDraw(5, ['Centro', 'Sombra', 'Recurso', 'Peligro', 'Consejo']);
  if (action === 'ouija') ouija();
  if (action === 'saveParanormal') saveParanormal();
  if (action === 'exportParanormal') exportParanormal();
  if (action === 'searchParanormal') {
    const q = ($('#paraSearch')?.value || '').toLowerCase();
    const log = store.get('paranormal', []).filter(x => `${x.title} ${x.place} ${x.type} ${x.body} ${(x.tags || []).join(' ')}`.toLowerCase().includes(q));
    $('#paranormalList').innerHTML = paranormalHTML(log);
  }
  if (action === 'rune1') runeDraw(1);
  if (action === 'rune3') runeDraw(3);
  if (action === 'runeAll') $('#out').innerHTML = `<div class="grid">${data.runes.map(r => `<article class="card"><h3>${esc(r[0])}</h3><p>${esc(r[1])}</p></article>`).join('')}</div>`;
  if (action === 'iching') iching();
  if (action === 'saveDream') saveDream();
  if (action === 'exportDreams') exportDreams();
  if (action === 'moonPrev') { let y = store.get('moonY', new Date().getFullYear()), m = store.get('moonM', new Date().getMonth()) - 1; if (m < 0) { m = 11; y--; } store.set('moonY', y); store.set('moonM', m); modules.luna(); }
  if (action === 'moonNext') { let y = store.get('moonY', new Date().getFullYear()), m = store.get('moonM', new Date().getMonth()) + 1; if (m > 11) { m = 0; y++; } store.set('moonY', y); store.set('moonM', m); modules.luna(); }
  if (action === 'moonToday') { store.set('moonY', new Date().getFullYear()); store.set('moonM', new Date().getMonth()); modules.luna(); }
  if (action === 'moonYear') renderYearView();
  if (action === 'ritual') ritual();
  if (action === 'quick') quick();
  if (action === 'compareSelected') compareSelected();
  if (action === 'compareLast') compareLast();
  if (action === 'compareTarot') compareByType('Tarot');
  if (action === 'compareRunas') compareByType('Runas');
  if (action === 'compareIChing') compareByType('I Ching');
  if (action === 'exportJSON') exportJSON();
  if (action === 'exportTXT') exportTXT();
  if (action === 'importBackup') importBackup();
  if (action === 'filterEncy') filterEncy();
  if (action === 'encyCategory') filterEncy(target?.dataset.cat || null);
  if (action === 'searchArchive') {
    const q = ($('#search')?.value || '').toLowerCase();
    $('#archiveList').innerHTML = archiveHTML(store.get('entries', []).filter(e => `${e.title} ${e.body} ${e.type} ${(e.tags || []).join(' ')}`.toLowerCase().includes(q)));
  }
  if (action === 'clearAll' && confirm('¿Borrar todos los datos locales de Arcanum 404?')) {
    ['entries', 'dreams', 'paranormal'].forEach(key => store.set(key, []));
    modules.archivo?.();
  }
  if (action === 'playAudio') startAudio();
  if (action === 'stopAudio') stopAudio();
}

let current = 'dashboard';
function openModule(name) {
  current = name;
  modules[name]();
  location.hash = name;
  $('#nav').classList.remove('open');
  $('#menuBtn').setAttribute('aria-expanded', 'false');
  panel.focus({ preventScroll: true });
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', event => {
  const opener = event.target.closest('[data-open]');
  if (opener && modules[opener.dataset.open]) openModule(opener.dataset.open);
  const action = event.target.closest('[data-act]');
  if (action) routeAct(action.dataset.act, action);
  const delEntry = event.target.closest('[data-del-entry]');
  if (delEntry) { store.set('entries', store.get('entries', []).filter(x => x.id !== delEntry.dataset.delEntry)); modules.archivo(); }
  const delDream = event.target.closest('[data-del-dream]');
  if (delDream) { store.set('dreams', store.get('dreams', []).filter(x => x.id !== delDream.dataset.delDream)); modules.suenos(); }
  const delParanormal = event.target.closest('[data-del-paranormal]');
  if (delParanormal) { store.set('paranormal', store.get('paranormal', []).filter(x => x.id !== delParanormal.dataset.delParanormal)); modules.paranormal(); }
});

document.addEventListener('change', event => {
  if (event.target?.id === 'backupFile') handleBackupFile(event.target.files?.[0]);
});

$('#menuBtn').onclick = () => {
  const nav = $('#nav');
  nav.classList.toggle('open');
  $('#menuBtn').setAttribute('aria-expanded', nav.classList.contains('open'));
};
$('#dailyBtn').onclick = () => {
  const pool = [...data.symbols, ...data.grimoire, ...data.runes, ...data.bestiary];
  const item = rnd(pool);
  $('#dailyTitle').textContent = item[0];
  $('#dailyText').textContent = item[1];
};
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
const initial = location.hash.replace('#', '');
openModule(initial && modules[initial] ? initial : 'dashboard');
