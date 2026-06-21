const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const panel = $('#panel');

const store = {
  get(k, fallback) {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; }
    catch { return fallback; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch { return false; }
  }
};

const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const uid = () => (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
const now = () => new Date().toLocaleString('es-ES', { dateStyle:'medium', timeStyle:'short' });
const isoDate = () => new Date().toISOString();

const tarot = ['El Loco','El Mago','La Sacerdotisa','La Emperatriz','El Emperador','El Hierofante','Los Enamorados','El Carro','La Justicia','El Ermitaño','La Rueda','La Fuerza','El Colgado','La Muerte','La Templanza','El Diablo','La Torre','La Estrella','La Luna','El Sol','El Juicio','El Mundo'];
const tarotMean = {
 'El Loco':'inicio, riesgo, salto de fe, camino sin mapa','El Mago':'voluntad, habilidad, enfoque, acto consciente','La Sacerdotisa':'secreto, intuición, silencio, conocimiento velado','La Emperatriz':'creación, cuerpo, abundancia, cuidado','El Emperador':'orden, estructura, límite, autoridad','El Hierofante':'tradición, rito, maestro, institución','Los Enamorados':'elección, vínculo, deseo, bifurcación','El Carro':'avance, control, victoria, tensión dirigida','La Justicia':'equilibrio, consecuencia, verdad, reparación','El Ermitaño':'retirada, búsqueda, lámpara interior, prudencia','La Rueda':'cambio, ciclo, azar, giro inevitable','La Fuerza':'dominio suave, coraje, paciencia, instinto domado','El Colgado':'pausa, sacrificio, inversión, otra mirada','La Muerte':'final, transición, poda, transformación','La Templanza':'mezcla, cura, moderación, puente','El Diablo':'atadura, obsesión, deseo, sombra material','La Torre':'ruptura, revelación, caída de lo falso','La Estrella':'esperanza, guía, limpieza, horizonte','La Luna':'sueño, niebla, miedo, imaginación','El Sol':'claridad, vitalidad, alegría, exposición','El Juicio':'llamada, despertar, rendición de cuentas','El Mundo':'cierre, integración, viaje completo'
};
const runes = [
 ['ᚠ Fehu','riqueza móvil, recursos, energía que circula'],['ᚢ Uruz','fuerza primaria, salud, resistencia'],['ᚦ Thurisaz','umbral, defensa, conflicto'],['ᚨ Ansuz','mensaje, palabra, inspiración'],['ᚱ Raidho','viaje, ritmo, dirección'],['ᚲ Kenaz','antorcha, técnica, revelación'],['ᚷ Gebo','don, alianza, intercambio'],['ᚹ Wunjo','gozo, clan, armonía'],['ᚺ Hagalaz','granizo, crisis, interrupción'],['ᚾ Nauthiz','necesidad, fricción, disciplina'],['ᛁ Isa','hielo, pausa, inmovilidad'],['ᛃ Jera','cosecha, temporada, paciencia'],['ᛇ Eihwaz','eje, muerte-vida, resistencia'],['ᛈ Perthro','azar, matriz, secreto'],['ᛉ Algiz','protección, alerta, santuario'],['ᛊ Sowilo','sol, victoria, claridad'],['ᛏ Tiwaz','justicia, sacrificio, norte moral'],['ᛒ Berkano','nacimiento, hogar, crecimiento'],['ᛖ Ehwaz','confianza, movimiento, cooperación'],['ᛗ Mannaz','humanidad, identidad, comunidad'],['ᛚ Laguz','agua, emoción, intuición'],['ᛜ Ingwaz','semilla, potencial, cierre interno'],['ᛞ Dagaz','amanecer, cambio, umbral luminoso'],['ᛟ Othala','herencia, raíz, territorio']
];
const symbols = [
 ['Ouroboros','ciclo, eternidad, autodevoración, retorno','Alquimia / emblemas herméticos'],['Pentáculo','protección, cinco elementos, microcosmos','Magia ceremonial y folclore moderno'],['Ankh','vida, aliento, continuidad','Egipto antiguo'],['Triskel','movimiento triple, transformación, flujo','Cultura céltica y atlántica'],['Ojo','vigilancia, conciencia, revelación','Mediterráneo y Próximo Oriente'],['Mercurio','mente, intercambio, alquimia, mensajero','Astrología / alquimia'],['Azufre','fuego interno, voluntad, alma alquímica','Alquimia'],['Sal','cuerpo, fijación, memoria material','Alquimia'],['Árbol de la Vida','emanaciones, mapa de correspondencias','Cábala occidental'],['Llave','acceso, secreto, permiso, frontera','Iconografía iniciática'],['Labrys','doble hacha, umbral, poder ritual','Mediterráneo antiguo'],['Vesica Piscis','intersección, nacimiento, geometría sagrada','Arte sacro y geometría'],['Espiral','retorno, crecimiento, trance','Arte megalítico'],['Rueda Solar','ciclo, estación, fuego','Europa antigua'],['Mano protectora','protección, límite, mirada desviada','Mediterráneo / Oriente Medio']
];
const bestiary = [
 ['Basilisco','Criatura de mirada letal en tradiciones europeas. Útil como símbolo de miedo paralizante.','Folclore europeo'],['Banshee','Figura del folclore irlandés asociada al lamento y al presagio.','Irlanda'],['Doppelgänger','Doble inquietante; tema excelente para identidad, sombra y paranoia.','Romanticismo germánico'],['Lamia','Entidad híbrida del imaginario mediterráneo, vinculada a deseo y peligro.','Grecia / Mediterráneo'],['Strigoi','Figura vampírica del folclore rumano.','Rumanía'],['Kelpie','Espíritu acuático cambiante del folclore escocés.','Escocia'],['Golem','Criatura de barro animada por palabra y propósito.','Tradición judía centroeuropea'],['Tulpas','Forma mental materializada en imaginarios teosóficos y modernos.','Teosofía / reinterpretación moderna'],['Manticora','Bestia compuesta, mezcla de humano, león y aguijón venenoso.','Bestiarios medievales'],['Nuckelavee','Entidad marina y ecuestre especialmente oscura del folclore de las Orcadas.','Orcadas'],['Jorōgumo','Araña cambiante asociada a seducción, trampa y transformación.','Japón'],['Ifrit','Espíritu de fuego poderoso en tradiciones islámicas y narrativas posteriores.','Oriente Medio'],['Leshy','Guardián del bosque, cambiante y ambiguo.','Folclore eslavo'],['Wendigo','Figura de hambre, invierno y deshumanización en relatos algonquinos.','Norteamérica algonquina'],['Acheri','Espíritu asociado a enfermedad y montaña en relatos del Himalaya.','Himalaya']
];
const correspondences = [
 ['Lavanda','calma, sueño, limpieza suave','Hierba'],['Romero','memoria, protección, claridad','Hierba'],['Salvia','purificación, cierre, frontera','Hierba'],['Laurel','victoria, visión, palabra oracular','Hierba'],['Ruda','defensa, corte, alejamiento','Hierba'],['Artemisa','sueño, luna, tránsito','Hierba'],['Obsidiana','sombra, corte, espejo oscuro','Piedra'],['Cuarzo','amplificación, claridad, foco','Piedra'],['Amatista','sueño, templanza, percepción','Piedra'],['Labradorita','umbral, brillo oculto, protección psíquica','Piedra'],['Hierro','defensa, límite, fuerza','Metal'],['Plata','luna, reflejo, intuición','Metal'],['Cobre','venus, conducción, unión','Metal'],['Mercurio','movilidad, lenguaje, transmutación','Metal / planeta'],['Saturno','tiempo, límite, ruina fértil','Planeta'],['Venus','atracción, arte, deseo','Planeta'],['Marte','conflicto, energía, ruptura','Planeta'],['Júpiter','expansión, ley, autoridad benéfica','Planeta'],['Luna','sueño, memoria, marea interior','Astro'],['Sol','claridad, vitalidad, exposición','Astro']
];
const dreamSymbols = ['agua','puerta','casa','madre','padre','niño','sombra','perro','gato','mar','bosque','escalera','ascensor','dientes','sangre','luz','tren','hotel','iglesia','pozo','llave','espejo','teléfono','pantalla','lluvia','carretera'];
const audioPresets = {
  biblioteca: { label:'Biblioteca antigua', freqs:[55,82.4,110], type:'triangle', pulse:0.08, desc:'Dron grave, madera antigua y respiración de sala cerrada.' },
  lluvia: { label:'Lluvia', freqs:[140,190,260,310], type:'sine', pulse:0.04, desc:'Textura irregular y suave, pensada para escritura nocturna.' },
  bosque: { label:'Bosque nocturno', freqs:[62,124,248], type:'sine', pulse:0.06, desc:'Zumbido bajo, insectos imaginarios y distancia.' },
  templo: { label:'Templo', freqs:[73.4,146.8,220], type:'sine', pulse:0.1, desc:'Resonancia ceremonial y aire de piedra.' },
  mar: { label:'Mar', freqs:[49,98,196], type:'triangle', pulse:0.05, desc:'Oleaje oscuro generado por osciladores lentos.' },
  viento: { label:'Viento', freqs:[88,132,176,264], type:'sawtooth', pulse:0.03, desc:'Corriente tenue para escenas de archivo abandonado.' },
  cosmico: { label:'Sonidos cósmicos', freqs:[41.2,61.7,123.4,246.8], type:'sine', pulse:0.12, desc:'Dron espacial, frío y amplio.' }
};

function saveEntry(type, title, body) {
  const entries = store.get('entries', []);
  entries.unshift({ id: uid(), type, title: String(title).slice(0, 120), body: String(body).slice(0, 5000), date: now(), iso: isoDate() });
  store.set('entries', entries.slice(0, 300));
}
function renderHeader(title, text) {
  panel.innerHTML = `<h2>${escapeHTML(title)}</h2><p class="panel-intro">${escapeHTML(text)}</p>`;
  $$('.side-nav button').forEach(b => b.classList.toggle('active', b.dataset.open === current));
}
function resultCard(title, text, badge='Resultado') {
  return `<article class="result"><span class="badge">${escapeHTML(badge)}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p></article>`;
}
function downloadFile(filename, mime, text) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 600);
}
function allArchiveData() {
  return { exportedAt: new Date().toISOString(), entries: store.get('entries', []), dreams: store.get('dreams', []), volume: store.get('volume', 0.12), preset: store.get('audioPreset', 'biblioteca') };
}
function exportJSON() { downloadFile('universo-404-archivo.json', 'application/json', JSON.stringify(allArchiveData(), null, 2)); }
function exportTXT() {
  const data = allArchiveData();
  const lines = ['UNIVERSO 404 · ARCHIVO LOCAL', `Exportado: ${new Date().toLocaleString('es-ES')}`, '', '== LECTURAS Y SESIONES =='];
  data.entries.forEach(e => lines.push(`[${e.date}] ${e.type} · ${e.title}`, e.body, ''));
  lines.push('== SUEÑOS ==');
  data.dreams.forEach(d => lines.push(`[${d.date}] ${d.title}`, d.body, ''));
  downloadFile('universo-404-archivo.txt', 'text/plain;charset=utf-8', lines.join('\n'));
}

let current = 'tarot';
const modules = {
  tarot() {
    renderHeader('Libro del Destino', 'Tiradas de tarot con historial automático y exportación desde Archivo 404.');
    panel.innerHTML += `<div class="controls"><button class="primary-btn" id="one">Carta única</button><button class="secondary-btn" id="three">Tirada de tres</button><button class="secondary-btn" data-open="archivo">Ver historial</button></div><div class="results" id="tarotResults"></div>`;
    $('#one').onclick = () => { const c = rnd(tarot); $('#tarotResults').innerHTML = resultCard(c, tarotMean[c], 'Carta'); saveEntry('Tarot', c, tarotMean[c]); };
    $('#three').onclick = () => { const cards = [...tarot].sort(() => Math.random() - .5).slice(0,3); $('#tarotResults').innerHTML = cards.map((c,i) => resultCard(c, tarotMean[c], ['Pasado','Presente','Umbral'][i])).join(''); saveEntry('Tarot', 'Tirada de tres cartas', cards.map(c => `${c}: ${tarotMean[c]}`).join('\n')); };
  },
  ouija() {
    renderHeader('Libro de los Espíritus', 'Tablero ficticio para sesiones atmosféricas. Respuestas narrativas generadas localmente, sin afirmar contacto real con entidades.');
    panel.innerHTML += `<div class="tool-card"><label>Pregunta<textarea id="q" maxlength="500" placeholder="Escribe tu pregunta..."></textarea></label><div class="controls"><button class="primary-btn" id="ask">Consultar tablero</button><button class="secondary-btn" id="clear">Limpiar</button><button class="secondary-btn" data-open="archivo">Sesiones guardadas</button></div><div id="answer"></div></div>`;
    const phrases = ['NO SIGAS LA VOZ, SIGUE LA HUELLA','EL NOMBRE CAMBIÓ AL SER LEÍDO','LA PUERTA NO ESTÁ CERRADA, ESTÁ RECORDANDO','TRES GOLPES EN EL SUEÑO, UNO EN LA CASA','NO ES UN FANTASMA, ES UNA REPETICIÓN','EL ARCHIVO 404 NO DEVUELVE LO QUE TOMA','LA CASA CONTESTA CUANDO DEJAS DE PREGUNTAR','EL ESPEJO APRENDIÓ TU GESTO'];
    $('#ask').onclick = () => { const a = rnd(phrases); $('#answer').innerHTML = resultCard(a, 'Respuesta narrativa generada para ambientación, escritura y juego.', 'Tablero'); saveEntry('Ouija', $('#q').value || 'Consulta sin pregunta', a); };
    $('#clear').onclick = () => { $('#q').value = ''; $('#answer').innerHTML = ''; };
  },
  runas() {
    renderHeader('Libro de las Runas', 'Elder Futhark completo, tiradas de una o tres runas, significados e historial.');
    panel.innerHTML += `<div class="controls"><button class="primary-btn" id="r1">Una runa</button><button class="secondary-btn" id="r3">Tres runas</button><button class="secondary-btn" data-open="archivo">Historial</button></div><div class="results" id="runes"></div><div class="tool-grid">${runes.map(r => `<article class="tool-card"><span class="badge">Elder Futhark</span><h3>${escapeHTML(r[0])}</h3><p>${escapeHTML(r[1])}</p></article>`).join('')}</div>`;
    const draw = n => { const rs = [...runes].sort(() => Math.random() - .5).slice(0,n); $('#runes').innerHTML = rs.map((r,i) => resultCard(r[0], r[1], n===3 ? ['Raíz','Tensión','Consejo'][i] : 'Runa')).join(''); saveEntry('Runas', `Tirada de ${n}`, rs.map(r => r.join(': ')).join('\n')); };
    $('#r1').onclick = () => draw(1); $('#r3').onclick = () => draw(3);
  },
  iching() {
    renderHeader('Libro de los Hexagramas', 'Genera seis líneas con monedas virtuales. Las líneas 6 y 9 son mutables y el historial permite comparar consultas.');
    panel.innerHTML += `<div class="controls"><button class="primary-btn" id="coins">Lanzar monedas</button><button class="secondary-btn" data-open="archivo">Comparar consultas</button></div><div id="hex"></div>`;
    $('#coins').onclick = () => { const lines = []; for (let i=0;i<6;i++){ const sum = [0,0,0].map(() => Math.random() < .5 ? 2 : 3).reduce((a,b) => a+b, 0); lines.unshift(sum); } const html = lines.map(n => `<div class="result hex-line"><strong>${n%2 ? '━━━━━━' : '━━  ━━'}</strong> <span class="badge">${n===6||n===9 ? 'mutable' : 'fija'}</span></div>`).join(''); const msg = 'Hexagrama generado. Lee de abajo hacia arriba: observa qué líneas mutan y qué patrón se repite.'; $('#hex').innerHTML = html + resultCard('Interpretación breve', msg, 'I Ching'); saveEntry('I Ching', 'Hexagrama', `Líneas: ${lines.join('-')}\n${msg}`); };
  },
  diario() {
    renderHeader('Libro de los Sueños', 'Diario privado con calendario, símbolos recurrentes, estadísticas y exportación local.');
    const dreams = store.get('dreams', []);
    const stats = dreamStats(dreams);
    panel.innerHTML += `<div class="tool-grid"><div class="tool-card"><input class="input" id="dreamTitle" maxlength="90" placeholder="Título del sueño"><textarea id="dreamText" maxlength="3000" placeholder="Describe el sueño..."></textarea><button class="primary-btn" id="saveDream">Guardar sueño</button><p class="hint">Privado: se guarda solo en este navegador.</p></div><div class="tool-card"><h3>Símbolos detectables</h3><p>${dreamSymbols.map(escapeHTML).join(', ')}</p><button class="secondary-btn" id="analyzeDreams">Analizar archivo</button></div><div class="tool-card"><h3>Estadísticas</h3><p><strong>${dreams.length}</strong> sueños guardados.</p><p>Mes activo: <strong>${escapeHTML(stats.topMonth || 'sin datos')}</strong></p><p>Símbolo dominante: <strong>${escapeHTML(stats.topSymbol || 'sin datos')}</strong></p></div></div><div id="dreamOut" class="results"></div><h3>Calendario de sueños</h3><div class="calendar mini">${renderDreamCalendar(dreams)}</div><div id="dreamList"></div>`;
    $('#saveDream').onclick = () => { const list = store.get('dreams', []); const item = { id:uid(), title:$('#dreamTitle').value || 'Sueño sin título', body:$('#dreamText').value, date:now(), iso:isoDate() }; list.unshift(item); store.set('dreams', list); saveEntry('Sueños', item.title, item.body || 'Registro sin descripción'); modules.diario(); };
    $('#analyzeDreams').onclick = () => { const counts = countDreamSymbols(store.get('dreams', [])); $('#dreamOut').innerHTML = counts.length ? counts.map(c => resultCard(c[0], `Aparece ${c[1]} veces en tu archivo.`, 'Símbolo')).join('') : resultCard('Sin patrones', 'Aún no hay símbolos recurrentes suficientes.', 'Análisis'); };
    renderDreams();
  },
  luna() {
    renderHeader('Libro Lunar', 'Fase lunar actual, calendario mensual aproximado, eventos del ciclo y correspondencias.');
    const phase = getMoonPhase(new Date());
    panel.innerHTML += `<div class="stats"><div class="stat"><strong>${phase.name}</strong><span>Fase actual aproximada</span></div><div class="stat"><strong>${phase.emoji}</strong><span>Símbolo</span></div><div class="stat"><strong>${phase.energy}</strong><span>Correspondencia</span></div><div class="stat"><strong>${new Date().toLocaleDateString('es-ES')}</strong><span>Fecha</span></div></div><div class="tool-card"><h3>Consejo de archivo</h3><p>${escapeHTML(phase.tip)}</p></div><h3>Calendario lunar mensual</h3><div class="calendar">${renderMoonCalendar(new Date())}</div><h3>Próximos eventos aproximados</h3><div class="results">${nextMoonEvents(new Date()).map(e => resultCard(e.title, e.date, e.badge)).join('')}</div>`;
  },
  grimorio() {
    renderHeader('Grimorio', 'Correspondencias culturales y simbólicas para escritura, ambientación, worldbuilding y consulta personal.');
    panel.innerHTML += `<div class="tool-grid">${correspondences.map(x => `<article class="tool-card"><span class="badge">${escapeHTML(x[2])}</span><h3>${escapeHTML(x[0])}</h3><p>${escapeHTML(x[1])}</p></article>`).join('')}</div>`;
  },
  bestiario() {
    renderHeader('Bestiario Prohibido', 'Criaturas de folclore y cultura comparada, presentadas como archivo cultural e histórico-literario.');
    panel.innerHTML += `<div class="tool-grid">${bestiary.map(x => `<article class="tool-card"><span class="badge">${escapeHTML(x[2])}</span><h3>${escapeHTML(x[0])}</h3><p>${escapeHTML(x[1])}</p></article>`).join('')}</div>`;
  },
  simbolos() {
    renderHeader('Codex Symbolorum', 'Alquimia, astrología, sigilos históricos, Árbol de la Vida y simbología comparada.');
    panel.innerHTML += `<div class="tool-grid">${symbols.map(x => `<article class="tool-card"><span class="badge">${escapeHTML(x[2])}</span><h3>${escapeHTML(x[0])}</h3><p>${escapeHTML(x[1])}</p></article>`).join('')}</div>`;
  },
  archivo() {
    renderHeader('Archivo 404', 'Historial visible de tarot, ouija, runas, I Ching y sueños. Exportación local en JSON o TXT.');
    const entries = store.get('entries', []);
    const dreams = store.get('dreams', []);
    panel.innerHTML += `<div class="stats"><div class="stat"><strong>${entries.length}</strong><span>lecturas/sesiones</span></div><div class="stat"><strong>${dreams.length}</strong><span>sueños</span></div><div class="stat"><strong>${entries.filter(e=>e.type==='Tarot').length}</strong><span>tarot</span></div><div class="stat"><strong>${entries.filter(e=>e.type==='I Ching').length}</strong><span>I Ching</span></div></div><div class="controls"><button class="primary-btn" id="exportJson">Exportar JSON</button><button class="secondary-btn" id="exportTxt">Exportar TXT</button><button class="tiny danger" id="clearArchive">Borrar archivo local</button></div><div id="archiveList"></div>`;
    $('#exportJson').onclick = exportJSON; $('#exportTxt').onclick = exportTXT;
    $('#clearArchive').onclick = () => { if (confirm('¿Borrar historial y sueños guardados en este navegador?')) { store.set('entries', []); store.set('dreams', []); modules.archivo(); } };
    renderArchive();
  },
  audio() {
    renderHeader('Cámara de Ecos', 'Presets ambientales generados con Web Audio: sin archivos externos, sin copyright y con volumen persistente.');
    const preset = store.get('audioPreset', 'biblioteca');
    panel.innerHTML += `<div class="tool-card"><label>Ambiente <select id="preset">${Object.entries(audioPresets).map(([k,v]) => `<option value="${k}" ${k===preset?'selected':''}>${escapeHTML(v.label)}</option>`).join('')}</select></label><div class="controls"><button class="primary-btn" id="playAudio">Activar ambiente</button><button class="secondary-btn" id="stopAudio">Detener</button></div><label>Volumen <input class="slider" type="range" min="0" max="0.35" step="0.01" id="vol"></label><p id="presetDesc">${escapeHTML(audioPresets[preset].desc)}</p></div>`;
    $('#vol').value = store.get('volume', 0.12);
    $('#vol').oninput = e => { store.set('volume', Number(e.target.value)); if (audioGain) audioGain.gain.value = Number(e.target.value); };
    $('#preset').onchange = e => { store.set('audioPreset', e.target.value); $('#presetDesc').textContent = audioPresets[e.target.value].desc; if (audioCtx) startAudio(); };
    $('#playAudio').onclick = startAudio; $('#stopAudio').onclick = stopAudio;
  }
};

function renderArchive() {
  const list = $('#archiveList'); if (!list) return;
  const entries = store.get('entries', []);
  if (!entries.length) { list.innerHTML = resultCard('Archivo vacío', 'Haz una tirada, consulta o sueño para empezar a guardar historial.', 'Archivo'); return; }
  list.innerHTML = entries.map(e => `<article class="entry-card"><div><span class="badge">${escapeHTML(e.type)}</span><strong>${escapeHTML(e.title)}</strong><small>${escapeHTML(e.date)}</small><p>${escapeHTML(e.body)}</p></div><button class="tiny danger" data-del-entry="${escapeHTML(e.id)}">Eliminar</button></article>`).join('');
  $$('[data-del-entry]').forEach(b => b.onclick = () => { store.set('entries', store.get('entries', []).filter(e => e.id !== b.dataset.delEntry)); modules.archivo(); });
}
function renderDreams() {
  const list = $('#dreamList'); if (!list) return;
  const dreams = store.get('dreams', []);
  list.innerHTML = dreams.map(d => `<article class="entry-card"><div><strong>${escapeHTML(d.title)}</strong><small>${escapeHTML(d.date)}</small><p>${escapeHTML(d.body)}</p></div><button class="tiny danger" data-del="${escapeHTML(d.id)}">Eliminar</button></article>`).join('');
  $$('[data-del]').forEach(b => b.onclick = () => { store.set('dreams', store.get('dreams', []).filter(d => d.id !== b.dataset.del)); modules.diario(); });
}
function countDreamSymbols(dreams) {
  const text = dreams.map(d => d.body.toLowerCase()).join(' ');
  return dreamSymbols.map(s => [s, (text.match(new RegExp(`\\b${s}\\b`, 'g')) || []).length]).filter(x => x[1]).sort((a,b) => b[1] - a[1]);
}
function dreamStats(dreams) {
  const counts = countDreamSymbols(dreams);
  const months = {};
  dreams.forEach(d => { const key = d.iso ? new Date(d.iso).toLocaleDateString('es-ES', { month:'long', year:'numeric' }) : 'sin fecha'; months[key] = (months[key] || 0) + 1; });
  const topMonth = Object.entries(months).sort((a,b)=>b[1]-a[1])[0]?.[0];
  return { topSymbol: counts[0]?.[0], topMonth };
}
function renderDreamCalendar(dreams) {
  const today = new Date();
  const year = today.getFullYear(); const month = today.getMonth();
  const first = new Date(year, month, 1); const days = new Date(year, month + 1, 0).getDate();
  const dreamDays = new Set(dreams.map(d => d.iso ? new Date(d.iso) : null).filter(Boolean).filter(d => d.getFullYear()===year && d.getMonth()===month).map(d => d.getDate()));
  let html = `<div class="cal-title">${today.toLocaleDateString('es-ES', { month:'long', year:'numeric' })}</div>`;
  ['L','M','X','J','V','S','D'].forEach(d => html += `<span class="cal-head">${d}</span>`);
  const offset = (first.getDay() + 6) % 7;
  for (let i=0;i<offset;i++) html += '<span></span>';
  for (let d=1; d<=days; d++) html += `<span class="cal-day ${dreamDays.has(d) ? 'marked' : ''}">${d}${dreamDays.has(d) ? ' ✦' : ''}</span>`;
  return html;
}
function getMoonPhase(date) {
  const lp = 2551443; const seconds = date.getTime() / 1000; const newMoon = new Date('2000-01-06T18:14:00Z').getTime() / 1000; const phase = ((seconds - newMoon) % lp) / lp;
  const phases = [['Luna nueva','🌑','inicio','Buen momento para abrir un registro, limpiar prioridades y formular una pregunta sencilla.'],['Creciente','🌒','siembra','Conviene desarrollar una idea y observar qué señales se repiten.'],['Cuarto creciente','🌓','decisión','El archivo pide acción concreta: elige una puerta y cruza.'],['Gibosa creciente','🌔','ajuste','Corrige, pule, escucha patrones.'],['Luna llena','🌕','revelación','Anota sueños y símbolos: lo oculto suele tomar forma narrativa.'],['Gibosa menguante','🌖','digestión','Integra lo visto sin precipitar conclusiones.'],['Cuarto menguante','🌗','corte','Elimina ruido, falsas pistas y cargas inútiles.'],['Menguante','🌘','cierre','Cierra ciclos, archiva aprendizajes y descansa.']];
  const i = Math.floor(phase * 8) % 8; return { name: phases[i][0], emoji: phases[i][1], energy: phases[i][2], tip: phases[i][3], index: i };
}
function renderMoonCalendar(date) {
  const year = date.getFullYear(); const month = date.getMonth(); const first = new Date(year, month, 1); const days = new Date(year, month + 1, 0).getDate();
  let html = `<div class="cal-title">${date.toLocaleDateString('es-ES', { month:'long', year:'numeric' })}</div>`;
  ['L','M','X','J','V','S','D'].forEach(d => html += `<span class="cal-head">${d}</span>`);
  const offset = (first.getDay() + 6) % 7; for (let i=0;i<offset;i++) html += '<span></span>';
  for (let d=1; d<=days; d++) { const ph = getMoonPhase(new Date(year, month, d)); html += `<span class="cal-day" title="${escapeHTML(ph.name)}">${d}<small>${ph.emoji}</small></span>`; }
  return html;
}
function nextMoonEvents(date) {
  const targets = {0:'Luna nueva', 2:'Cuarto creciente', 4:'Luna llena', 6:'Cuarto menguante'};
  const found = []; const seen = new Set();
  for (let i=0;i<60 && found.length<4;i++) { const d = new Date(date); d.setDate(date.getDate() + i); const ph = getMoonPhase(d); if (targets[ph.index] && !seen.has(ph.index)) { found.push({ badge:'Evento lunar', title:targets[ph.index], date:d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' }) }); seen.add(ph.index); } }
  return found;
}

let audioCtx, audioGain, oscillators = [], lfos = [];
function startAudio() {
  stopAudio();
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioGain = audioCtx.createGain();
  audioGain.gain.value = store.get('volume', 0.12);
  audioGain.connect(audioCtx.destination);
  const preset = audioPresets[store.get('audioPreset', 'biblioteca')] || audioPresets.biblioteca;
  preset.freqs.forEach((f, i) => {
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); const lfo = audioCtx.createOscillator(); const lg = audioCtx.createGain();
    o.type = preset.type; o.frequency.value = f * (1 + i * 0.002);
    g.gain.value = 0.06 / (i + 1);
    lfo.frequency.value = preset.pulse * (i + 1); lg.gain.value = 0.025;
    lfo.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(audioGain);
    o.start(); lfo.start(); oscillators.push(o); lfos.push(lfo);
  });
}
function stopAudio() { [...oscillators, ...lfos].forEach(o => { try { o.stop(); } catch {} }); oscillators = []; lfos = []; if (audioCtx) { audioCtx.close(); audioCtx = null; } }
function openModule(name) { current = name; modules[name](); location.hash = name; $('#moduleNav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false'); panel.scrollIntoView({ behavior:'smooth', block:'start' }); }

document.addEventListener('click', e => { const opener = e.target.closest('[data-open]'); if (opener && modules[opener.dataset.open]) openModule(opener.dataset.open); });
$('#menuBtn').onclick = () => { const nav = $('#moduleNav'); nav.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', nav.classList.contains('open')); };
$('#dailyBtn').onclick = () => { const pool = [...symbols.map(s=>[s[0],s[1]]), ...runes.map(r=>[r[0],r[1]]), ...correspondences.map(c=>[c[0],c[1]])]; const x = rnd(pool); $('#dailyTitle').textContent = x[0]; $('#dailyText').textContent = x[1]; };
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {})); }
openModule(location.hash.replace('#','') && modules[location.hash.replace('#','')] ? location.hash.replace('#','') : 'tarot');
