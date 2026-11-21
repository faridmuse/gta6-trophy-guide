// Leonida Trophy Guide — checklist, roadmap, missables and cited guides.
// Static and offline: the only fetch is data/trophies.json from this same
// folder, and nothing else is requested at run time. Progress and the spoiler
// setting live in localStorage; export/import move them as a JSON file.
const EARNED_KEY = 'leonida-trophies-earned-v1';
const SPOILER_KEY = 'leonida-trophies-spoiler-v1';
const DEMO_EARNED = [2, 3, 8, 16, 18, 21, 28, 33, 42, 44, 46, 53, 55];

const KIND_LABELS = {
  story: 'Story', strangers: 'Strangers', collectibles: 'Collectibles',
  activities: 'Activities', crime: 'Crime & combat', money: 'Money & property',
  exploration: 'Exploration', secrets: 'Secrets', completion: '100% completion',
  platinum: 'Platinum',
};

// Roadmap stages, built from the official descriptions: story chapters and
// missions first, then side content, then clean-up, then the platinum.
const ROADMAP = [
  { title: 'Play the story', text: 'Chapters 1–4, the named story missions and the finale. All 13 story trophies unlock automatically — just play. Meditate at every spot you pass (see Missables) and start stranger strands as they appear.',
    ids: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 7] },
  { title: 'Strangers & Freaks', text: 'Finish the stranger mission strands — Andy, Kenton, Billy, Randy, Tyrone, Bret and the rest. Any 8 complete strands earn the silver; the individual finals are their own trophies.',
    ids: [22, 23, 24, 26, 27, 29, 25] },
  { title: 'Activities & races', text: 'Try every activity once, then work the activity trophies: 250 stunts, 42 gold shooting-range challenges, drone races at every Top Fun location, 20 different race wins, fishing, the arcade and bowling.',
    ids: [16, 15, 17, 18, 19, 20, 21, 46, 51] },
  { title: 'Collectibles & exploring', text: 'Cards (3 full sets), WAiNK at 100 locations, 100 vehicles discovered, and exploring all of Leonida. Fold these into travel — they reward the same roaming.',
    ids: [30, 31, 35, 42] },
  { title: 'Crime, combat & money', text: 'Robberies (5 bank vaults, an armored truck, a jewelry store unseen, one illegal operation per gang), combat feats, and the money: $250,000 laundered, $100,000 spent, all garages bought, 10 vehicles on Scooter Bros.',
    ids: [32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 45, 52, 53, 54, 55] },
  { title: 'Secrets & the platinum', text: 'The five cryptic trophies, then 100% completion for the gold, and the platinum pops with it. The cryptic methods are unconfirmed — each guide says so — so check back as the community pins them down.',
    ids: [44, 47, 48, 49, 50, 14, 1] },
];

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEl = $('detail');

let trophies = [];
let sources = {};
let earned = new Set();
let spoiler = true;
let selectedId = null;

function loadSaved() {
  try { earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]')); } catch { earned = new Set(); }
  const s = localStorage.getItem(SPOILER_KEY);
  spoiler = s === null ? true : s === '1';
  // Demo progress for screenshots (?demo or #demo): seed 13 earned only when
  // the reader has no saved progress yet.
  if ((location.search.includes('demo') || location.hash.includes('demo')) && earned.size === 0) {
    earned = new Set(DEMO_EARNED);
    $('demoNote').hidden = false;
    saveEarned();
  }
}
function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}
function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
}

function isStoryHidden(t) {
  return spoiler && t.kind === 'story' && !earned.has(t.id);
}
function displayName(t) {
  return isStoryHidden(t) ? 'Hidden story trophy' : t.name;
}
function displayDesc(t) {
  return isStoryHidden(t) ? 'Complete the story to reveal this trophy. (Spoiler setting is on.)' : t.description;
}

function gradeCounts() {
  const out = {};
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const total = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    out[g] = `${got}/${total}`;
  }
  return out;
}

function renderProgress() {
  const n = earned.size;
  const total = trophies.length || 55;
  $('earnedCount').textContent = n;
  $('progressFill').style.width = `${Math.round((n / total) * 100)}%`;
  $('progressPct').textContent = `${Math.round((n / total) * 100)}% to the platinum`;
  const c = gradeCounts();
  $('gradeCounts').innerHTML =
    `Platinum <b>${c.platinum}</b> &middot; Gold <b>${c.gold}</b> &middot; Silver <b>${c.silver}</b> &middot; Bronze <b>${c.bronze}</b>`;
}

function filteredTrophies() {
  const q = $('search').value.trim().toLowerCase();
  const kind = $('kind').value;
  const grade = $('grade').value;
  const earnedOnly = $('earnedOnly').checked;
  return trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (earnedOnly && !earned.has(t.id)) return false;
    if (kind === 'missable') { if (t.missable !== 'possible') return false; }
    else if (kind !== 'all' && t.kind !== kind) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${KIND_LABELS[t.kind] ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderList() {
  const shown = filteredTrophies();
  $('listCount').textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earned.size} earned`;
  $('emptyMsg').hidden = shown.length !== 0;
  listEl.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    if (earned.has(t.id)) li.classList.add('earned');
    if (selectedId === t.id) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${displayName(t)} earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveEarned();
      renderAll();
    });
    const mid = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = displayName(t);
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = displayDesc(t);
    const tags = document.createElement('div');
    tags.className = 'tags';
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = KIND_LABELS[t.kind] ?? t.kind;
    tags.append(kindTag);
    if (t.hidden && !isStoryHidden(t)) {
      const h = document.createElement('span');
      h.className = 'tag hiddenTag';
      h.textContent = 'Hidden on PSN';
      tags.append(h);
    }
    if (t.missable === 'possible') {
      const m = document.createElement('span');
      m.className = 'tag miss';
      m.textContent = 'Possibly missable';
      tags.append(m);
    }
    if (t.target !== null && t.target !== undefined) {
      const tg = document.createElement('div');
      tg.className = 'target';
      tg.textContent = `Target: ${t.target.toLocaleString('en-US')}`;
      mid.append(name, desc, tags, tg);
    } else {
      mid.append(name, desc, tags);
    }
    const badge = document.createElement('span');
    badge.className = `gradeBadge grade-${t.grade}`;
    badge.textContent = t.grade;
    li.append(box, mid, badge);
    li.addEventListener('click', () => { selectTrophy(t.id); });
    listEl.append(li);
  }
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    detailEl.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = 'Pick a trophy';
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = 'Click any trophy in the list to see its full guide here: what to do, where and how, when it can be missed, and the sources behind each fact.';
    const p2 = document.createElement('p');
    p2.className = 'hint';
    p2.textContent = 'Tick the box beside a trophy to mark it earned. Your progress is saved in this browser.';
    detailEl.append(h, p, p2);
    return;
  }
  detailEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const d = document.createElement('p');
  d.className = 'tdesc';
  d.textContent = displayDesc(t);
  const meta = document.createElement('p');
  meta.innerHTML = '';
  const badge = document.createElement('span');
  badge.className = `gradeBadge grade-${t.grade}`;
  badge.textContent = t.grade;
  meta.append(badge, document.createTextNode(`  ${KIND_LABELS[t.kind] ?? t.kind}`));
  if (t.hidden) meta.append(document.createTextNode('  ·  Hidden on PSN until earned'));
  if (t.target !== null && t.target !== undefined) {
    meta.append(document.createTextNode(`  ·  Target: ${t.target.toLocaleString('en-US')}`));
  }
  detailEl.append(h, d, meta);

  const hGuide = document.createElement('h4');
  hGuide.textContent = 'Guide — what to do, where and how';
  const g = document.createElement('p');
  g.textContent = isStoryHidden(t) ? 'Earn this trophy to reveal its guide.' : t.guide;
  detailEl.append(hGuide, g);

  const missBox = document.createElement('div');
  if (t.missable === 'possible') {
    missBox.className = 'warn';
    const hm = document.createElement('h4');
    hm.textContent = '⚠ Possibly missable — read this first';
    const pm = document.createElement('p');
    pm.textContent = isStoryHidden(t) ? 'Earn this trophy to reveal its guide.' : t.missableNote;
    missBox.append(hm, pm);
  } else {
    const hm = document.createElement('h4');
    hm.textContent = 'When it can be missed';
    const pm = document.createElement('p');
    pm.textContent = isStoryHidden(t) ? 'Earn this trophy to reveal its guide.' : t.missableNote;
    missBox.append(hm, pm);
  }
  detailEl.append(missBox);

  const hSrc = document.createElement('h4');
  hSrc.textContent = 'Sources';
  const ul = document.createElement('ul');
  ul.className = 'src';
  for (const s of t.sources ?? []) {
    const li = document.createElement('li');
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.rel = 'noopener';
      li.append(a);
    } else {
      li.textContent = s.name;
    }
    ul.append(li);
  }
  const own = document.createElement('li');
  own.textContent = 'Guide text: this entry’s own words, from the official description — not yet checked in the game.';
  ul.append(own);
  detailEl.append(hSrc, ul);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'earnBtn';
  btn.textContent = earned.has(t.id) ? '✓ Earned — click to unmark' : 'Mark as earned';
  btn.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
    saveEarned();
    renderAll();
  });
  detailEl.append(btn);
}

function renderRoadmap() {
  const box = $('roadmapStages');
  box.replaceChildren();
  ROADMAP.forEach((stage, i) => {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    const num = document.createElement('span');
    num.className = 'stageNum';
    num.textContent = i + 1;
    h.append(num, document.createTextNode(stage.title));
    const p = document.createElement('p');
    p.textContent = stage.text;
    const chips = document.createElement('div');
    chips.className = 'stageTrophies';
    for (const id of stage.ids) {
      const t = trophies.find((x) => x.id === id);
      if (!t) continue;
      const s = document.createElement('span');
      if (earned.has(id)) s.classList.add('done');
      if (t.missable === 'possible') s.classList.add('miss');
      s.textContent = `${earned.has(id) ? '✓ ' : ''}${t.name}${t.missable === 'possible' ? ' ⚠' : ''}`;
      s.title = t.description;
      s.addEventListener('click', () => { selectTrophy(id); });
      s.style.cursor = 'pointer';
      chips.append(s);
    }
    const done = stage.ids.filter((id) => earned.has(id)).length;
    const bar = document.createElement('p');
    bar.className = 'stageBar';
    bar.textContent = `${done} of ${stage.ids.length} earned in this stage`;
    li.append(h, p, chips, bar);
    box.append(li);
  });
}

function renderMissables() {
  const box = $('missableList');
  box.replaceChildren();
  for (const t of trophies.filter((x) => x.missable === 'possible')) {
    const card = document.createElement('div');
    card.className = 'card';
    const h = document.createElement('h3');
    h.textContent = `${t.name} — possibly missable`;
    const p = document.createElement('p');
    p.textContent = t.guide;
    const p2 = document.createElement('p');
    p2.textContent = t.missableNote;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ghost';
    btn.textContent = earned.has(t.id) ? '✓ Earned' : 'Mark as earned';
    btn.addEventListener('click', () => {
      if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
      saveEarned();
      renderAll();
    });
    card.append(h, p, p2, btn);
    box.append(card);
  }
  const ok = document.createElement('div');
  ok.className = 'card';
  ok.style.borderColor = 'var(--line)';
  const h = document.createElement('h3');
  h.textContent = 'Everything else: not missable';
  const p = document.createElement('p');
  p.textContent = 'The other 54 trophies are not flagged as missable by any guide: 13 story trophies unlock automatically, and every activity, race, robbery, collectible and money trophy stays open in free roam after the story. The full list is the checklist — filter by “Missable” to see the one flagged trophy on its own.';
  ok.append(h, p);
  box.append(ok);
}

function renderSources() {
  const ul = $('sourceList');
  ul.replaceChildren();
  for (const s of Object.values(sources)) {
    const li = document.createElement('li');
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.rel = 'noopener';
      li.append(a);
    } else {
      li.textContent = s.name;
    }
    ul.append(li);
  }
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
  renderMissables();
}

function showView(name) {
  for (const v of ['checklist', 'roadmap', 'missables', 'sources']) {
    $('view-' + v).hidden = v !== name;
  }
  for (const a of document.querySelectorAll('.tabs a')) {
    a.classList.toggle('active', a.dataset.view === name);
  }
  $('toolbar').style.display = name === 'checklist' ? '' : 'none';
}

function selectTrophy(id) {
  selectedId = id;
  showView('checklist');
  if (location.hash !== `#trophy/${id}`) history.replaceState(null, '', `#trophy/${id}`);
  renderList();
  renderDetail();
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function route() {
  const h = location.hash.replace(/^#/, '');
  if (h.startsWith('trophy/')) {
    const id = Number(h.slice('trophy/'.length));
    if (trophies.some((t) => t.id === id)) { selectedId = id; showView('checklist'); renderAll(); return; }
  }
  if (['roadmap', 'missables', 'sources', 'checklist'].includes(h)) showView(h);
  else showView('checklist');
  renderAll();
}

async function boot() {
  loadSaved();
  $('spoiler').checked = spoiler;
  let data;
  try {
    const res = await fetch('data/trophies.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    detailEl.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = 'Could not load the trophy list';
    const p = document.createElement('p');
    p.textContent = 'This guide loads app/data/trophies.json from its own folder. If you opened index.html directly from disk (file://), serve the app/ folder with a static server instead — for example: node serve.ts — then open the address it prints. No network is needed.';
    detailEl.append(h, p);
    throw err;
  }
  trophies = data.trophies;
  sources = data.sources ?? {};
  renderSources();
  route();
}

$('search').addEventListener('input', renderList);
$('kind').addEventListener('change', renderList);
$('grade').addEventListener('change', renderList);
$('earnedOnly').addEventListener('change', renderList);
$('spoiler').addEventListener('change', () => {
  spoiler = $('spoiler').checked;
  saveSpoiler();
  renderAll();
});
$('exportBtn').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b).map((id) => trophies.find((t) => t.id === id)?.name).filter(Boolean),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const byName = new Map(trophies.map((t) => [t.name, t.id]));
    const next = new Set();
    for (const n of names) if (byName.has(n)) next.add(byName.get(n));
    earned = next;
    saveEarned();
    renderAll();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});
window.addEventListener('hashchange', route);

boot();
