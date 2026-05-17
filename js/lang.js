/* ============================================================
   DUNDAL GANTHIAKH — Language switcher
   © Jesse Joel Rogers & Mike Ba — CC BY-NC 4.0
   ============================================================ */

const LANGS = [
  { code: 'fr',  label: 'Français',  file: 'lang/fr.json'  },
  { code: 'en',  label: 'English',   file: 'lang/en.json'  },
  { code: 'wo',  label: 'Wolof',     file: 'lang/wo.json'  },
  { code: 'ff',  label: 'Pulaar',    file: 'lang/ff.json'  },
  { code: 'ar',  label: 'العربية',   file: 'lang/ar.json'  }
];

const DEFAULT_LANG = 'fr';

/* ── Cache fetched language data ─────────────────────────── */
const langCache = {};

async function fetchLang(code) {
  if (langCache[code]) return langCache[code];
  const entry = LANGS.find(l => l.code === code);
  if (!entry) return null;
  try {
    const res = await fetch(entry.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    langCache[code] = data;
    return data;
  } catch (e) {
    console.warn(`[lang.js] Could not load ${entry.file}:`, e.message);
    return null;
  }
}

/* ── Apply language data to the DOM ─────────────────────── */
function applyLang(data) {
  if (!data) return;

  /* Direction */
  document.documentElement.lang = data.lang;
  document.documentElement.dir  = data.dir || 'ltr';
  document.body.classList.toggle('rtl', data.dir === 'rtl');

  /* Helper: set innerHTML safely */
  const set = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  /* Hero */
  set('hero-tag',        data.hero_tag       || '');
  set('hero-title',      data.hero_title      || '');
  set('hero-name-pulaar',data.hero_name_pulaar|| '');
  set('hero-sub',        data.hero_sub        || '');
  setText('hero-meta-date',    data.hero_meta_date    || '');
  setText('hero-meta-subjects',data.hero_meta_subjects|| '');
  setText('hero-meta-context', data.hero_meta_context || '');
  setText('hero-meta-cc',      data.hero_meta_cc      || '');

  /* ToC */
  setText('toc-title', data.toc_title || '');
  const tocList = document.getElementById('toc-list');
  if (tocList && data.toc_items) {
    tocList.innerHTML = data.toc_items
      .map(item => `<li><strong>${item.split(' — ')[0]}</strong>${item.includes(' — ') ? ' — ' + item.split(' — ').slice(1).join(' — ') : ''}</li>`)
      .join('');
  }

  /* Part labels and titles */
  for (let i = 1; i <= 6; i++) {
    setText(`part${i}-label`, data[`part${i}_label`] || '');
    set(`part${i}-title`,     data[`part${i}_title`]  || '');
  }

  /* Part 1 body */
  set('part1-body1', data.part1_body1 || '');
  set('part1-body2', data.part1_body2 || '');
  setText('callout-label-thesis', data.callout_label_thesis || '');
  set('callout-thesis', data.callout_thesis || '');

  const fmList = document.getElementById('failure-modes-list');
  if (fmList && data.failure_modes) {
    fmList.innerHTML = data.failure_modes.map(m => `<li>${m}</li>`).join('');
  }
  set('failure-modes-intro', data.failure_modes_intro || '');
  set('failure-modes-outro', data.failure_modes_outro || '');

  /* Part 2 body */
  set('part2-intro', data.part2_intro || '');

  /* Plant cards */
  if (data.plants) {
    ['moringa','duckweed','azolla','spirulina'].forEach(key => {
      const p = data.plants[key];
      if (!p) return;
      setText(`${key}-name`,  p.name  || '');
      setText(`${key}-local`, p.local || '');
      const statsEl = document.getElementById(`${key}-stats`);
      if (statsEl && p.stats) {
        statsEl.innerHTML = p.stats.map(([label, val]) =>
          `<div class="plant-stat"><span class="stat-label">${label}</span><span class="stat-val">${val}</span></div>`
        ).join('');
      }
    });
  }

  /* Plant narrative bodies */
  set('moringa-title',   data.moringa_title   || '');
  set('moringa-body1',   data.moringa_body1   || '');
  set('moringa-body2',   data.moringa_body2   || '');
  set('moringa-body3',   data.moringa_body3   || '');
  set('duckweed-title',  data.duckweed_title  || '');
  set('duckweed-body1',  data.duckweed_body1  || '');
  set('duckweed-body2',  data.duckweed_body2  || '');
  set('azolla-title',    data.azolla_title    || '');
  set('azolla-body1',    data.azolla_body1    || '');
  set('azolla-body2',    data.azolla_body2    || '');
  set('spirulina-title', data.spirulina_title || '');
  set('spirulina-body1', data.spirulina_body1 || '');
  set('spirulina-body2', data.spirulina_body2 || '');

  /* Video captions */
  set('video-moringa-title',   data.video_moringa_title   || '');
  set('video-moringa-caption', data.video_moringa_caption || '');
  set('video-moringa-print',   data.video_moringa_print   || '');
  set('video-spirulina-title', data.video_spirulina_title || '');
  set('video-spirulina-caption',data.video_spirulina_caption || '');
  set('video-spirulina-print', data.video_spirulina_print || '');

  /* Part 3 */
  set('part3-intro', data.part3_intro || '');
  const thead = document.getElementById('gap-table-head');
  if (thead && data.table_headers) {
    thead.innerHTML = `<tr>${data.table_headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  }
  const tbody = document.getElementById('gap-table-body');
  if (tbody && data.table_rows) {
    tbody.innerHTML = data.table_rows.map(row =>
      `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('');
  }

  /* Part 4 */
  set('part4-intro',      data.part4_intro    || '');
  set('system-title',     data.system_title   || '');
  set('system-caption',   data.system_caption || '');
  set('part4-body',       data.part4_body     || '');

  /* System nodes */
  const flowEl = document.getElementById('system-flow');
  if (flowEl && data.system_nodes) {
    flowEl.innerHTML = data.system_nodes.map((node, i) => {
      const arrow = i < data.system_nodes.length - 1
        ? `<div class="sys-arrow" aria-hidden="true">→</div>` : '';
      return `<div class="sys-node"><strong>${node[0]}</strong>${node[1]}</div>${arrow}`;
    }).join('');
  }

  /* Part 5 priorities */
  set('part5-intro', data.part5_intro || '');
  const prioEl = document.getElementById('priority-list');
  if (prioEl && data.priorities) {
    prioEl.innerHTML = data.priorities.map((p, i) =>
      `<div class="priority-item">
        <div class="priority-num" aria-label="${i+1}">${i+1}</div>
        <div>
          <div class="priority-title">${p.title}</div>
          <div class="priority-body">${p.body}</div>
        </div>
      </div>`
    ).join('');
  }

  /* Part 6 risks */
  setText('tech-risks-title',   data.tech_risks_title   || '');
  setText('social-risks-title', data.social_risks_title || '');
  const techRiskEl = document.getElementById('tech-risks-list');
  if (techRiskEl && data.tech_risks) {
    techRiskEl.innerHTML = data.tech_risks.map(r => `<li>${r}</li>`).join('');
  }
  const socialRiskEl = document.getElementById('social-risks-list');
  if (socialRiskEl && data.social_risks) {
    socialRiskEl.innerHTML = data.social_risks.map(r => `<li>${r}</li>`).join('');
  }
  setText('callout-label-leverage', data.callout_label_leverage || '');
  set('callout-leverage',           data.callout_leverage       || '');
  set('leverage-body',              data.leverage_body          || '');

  /* References heading */
  setText('references-label', data.references_label || '');
  set('references-title',     data.references_title || '');

  /* Footer */
  set('footer-brand',  data.footer_brand  || '');
  set('footer-sub',    data.footer_sub    || '');
  set('footer-note',   data.footer_note   || '');

  /* Lang bar label */
  setText('lang-bar-label', data.lang_label || '');

  /* Update active button */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === data.lang;
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

/* ── Switch language ─────────────────────────────────────── */
async function switchLang(code) {
  const data = await fetchLang(code);
  if (!data) {
    console.warn(`[lang.js] Language "${code}" not available.`);
    return;
  }
  applyLang(data);
  localStorage.setItem('dg-lang', code);
  history.replaceState(null, '', `?lang=${code}`);
}

/* ── Build lang buttons ──────────────────────────────────── */
function buildLangBar() {
  const bar = document.getElementById('lang-buttons');
  if (!bar) return;
  bar.innerHTML = LANGS.map(l =>
    `<button class="lang-btn" data-lang="${l.code}" aria-current="false"
      onclick="switchLang('${l.code}')">${l.label}</button>`
  ).join('');
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  buildLangBar();

  /* Priority: URL param → localStorage → default */
  const urlLang   = new URLSearchParams(window.location.search).get('lang');
  const storedLang = localStorage.getItem('dg-lang');
  const initLang   = LANGS.find(l => l.code === urlLang)  ? urlLang
                   : LANGS.find(l => l.code === storedLang)? storedLang
                   : DEFAULT_LANG;

  /* Preload default language before showing */
  await switchLang(initLang);
});
