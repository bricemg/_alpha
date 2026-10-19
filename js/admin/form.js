// Form utilities for admin panel

function collectFormData(content) {
  const next = JSON.parse(JSON.stringify(content));

  // Site info
  next.site.title = document.getElementById('siteTitle').value.trim() || 'BRICEMG / STUDIO';
  next.site.subtitle = document.getElementById('siteSubtitle').value.trim() || 'DESIGN / CODE / VISION';
  next.site.heroClaim = document.getElementById('heroClaim').value.trim();
  next.site.intro = document.getElementById('intro').value.trim();
  next.site.about = document.getElementById('about').value.trim();
  next.site.email = document.getElementById('email').value.trim();

  // Collect all card fields
  const cardFields = ['title', 'code', 'desc', 'type', 'status'];
  cardFields.forEach(field => {
    document.querySelectorAll(`.card-${field}`).forEach(el => {
      const index = parseInt(el.getAttribute('data-index'));
      next.cards[index][field] = el.value.trim();
    });
  });

  // Collect all project fields
  const projectFields = ['title', 'code', 'desc', 'type', 'phase'];
  projectFields.forEach(field => {
    document.querySelectorAll(`.project-${field}`).forEach(el => {
      const index = parseInt(el.getAttribute('data-index'));
      next.projects[index][field] = el.value.trim();
    });
  });

  // Collect theme fields
  const theme = {};
  const themeFields = ['bg','cell','hair','ink','inkSoft','red','borderRadius','gap','layout','cardShadow','borderStyle','titleSize','textSize','font'];
  themeFields.forEach(field => {
    const el = document.getElementById(`theme-${field}`);
    if (!el) return;
    if (el.type === 'checkbox') theme[field] = el.checked;
    else if (el.type === 'number' || el.type === 'range') theme[field] = Number(el.value);
    else theme[field] = el.value;
  });

  next.theme = theme;
  return next;
}

function buildCardFieldsHTML(content) {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  content.cards.forEach((card, index) => {
    const section = document.createElement('div');
    section.className = 'card-section';

    section.innerHTML = `
      <div class="field-group-label">CARTE ${index + 1}</div>
      <div class="field">
        <label>Titre</label>
        <input class="card-title" data-index="${index}" type="text" value="${card.title}" />
      </div>
      <div class="field">
        <label>Code</label>
        <input class="card-code" data-index="${index}" type="text" value="${card.code}" />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea class="card-desc" data-index="${index}">${card.desc}</textarea>
      </div>
      <div class="field">
        <label>Type</label>
        <input class="card-type" data-index="${index}" type="text" value="${card.type}" />
      </div>
      <div class="field">
        <label>Statut</label>
        <input class="card-status" data-index="${index}" type="text" value="${card.status}" />
      </div>
    `;
    container.appendChild(section);
  });
}

function buildProjectFieldsHTML(content) {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '';

  content.projects.forEach((project, index) => {
    const section = document.createElement('div');
    section.className = 'project-section';

    section.innerHTML = `
      <div class="field-group-label">PROJET ${index + 1}</div>
      <div class="field">
        <label>Titre</label>
        <input class="project-title" data-index="${index}" type="text" value="${project.title}" />
      </div>
      <div class="field">
        <label>Code</label>
        <input class="project-code" data-index="${index}" type="text" value="${project.code}" />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea class="project-desc" data-index="${index}">${project.desc}</textarea>
      </div>
      <div class="field">
        <label>Type</label>
        <input class="project-type" data-index="${index}" type="text" value="${project.type}" />
      </div>
      <div class="field">
        <label>Phase</label>
        <input class="project-phase" data-index="${index}" type="text" value="${project.phase}" />
      </div>
    `;
    container.appendChild(section);
  });
}

function buildThemeFieldsHTML(content) {
  const container = document.getElementById('themeContainer');
  container.innerHTML = '';
  const t = content.theme || {};

  const html = `
    <div class="field"><label>Fond (background)</label><input id="theme-bg" type="color" value="${t.bg || '#e3e3e3'}" /></div>
    <div class="field"><label>Carte (cell)</label><input id="theme-cell" type="color" value="${t.cell || '#f0f0f0'}" /></div>
    <div class="field"><label>Contour (hair)</label><input id="theme-hair" type="color" value="${t.hair || '#d8d8d8'}" /></div>
    <div class="field"><label>Texte (ink)</label><input id="theme-ink" type="color" value="${t.ink || '#2e2e2e'}" /></div>
    <div class="field"><label>Accent (red)</label><input id="theme-red" type="color" value="${t.red || '#d71921'}" /></div>
    <div class="field"><label>Arrondi (border-radius) <span id="label-borderRadius"></span></label><input id="theme-borderRadius" type="range" min="0" max="60" value="${t.borderRadius || 22}" /></div>
    <div class="field"><label>Espacement (gap) <span id="label-gap"></span></label><input id="theme-gap" type="range" min="0" max="40" value="${t.gap || 10}" /></div>
    <div class="field"><label>Layout cartes</label>
      <select id="theme-layout">
        <option value="grid">Grid</option>
        <option value="bento">Bento</option>
        <option value="metro">Metro</option>
        <option value="masonry">Masonry</option>
      </select>
    </div>
    <div class="field"><label>Ombre carte</label><input id="theme-cardShadow" type="checkbox" ${t.cardShadow ? 'checked' : ''} /></div>
    <div class="field"><label>Style bord</label>
      <select id="theme-borderStyle">
        <option value="none">None</option>
        <option value="subtle">Subtle</option>
        <option value="strong">Strong</option>
      </select>
    </div>
    <div class="field"><label>Taille titre (px)</label><input id="theme-titleSize" type="number" min="12" max="72" value="${t.titleSize || 38}" /></div>
    <div class="field"><label>Taille texte (px)</label><input id="theme-textSize" type="number" min="9" max="24" value="${t.textSize || 12}" /></div>
    <div class="field"><label>Police</label>
      <select id="theme-font">
        <option value="mono">IBM Plex Mono (mono)</option>
        <option value="dot">Doto (display)</option>
        <option value="system">System</option>
      </select>
    </div>
  `;

  container.innerHTML = html;

  // set selects to current
  document.getElementById('theme-layout').value = t.layout || 'grid';
  document.getElementById('theme-borderStyle').value = t.borderStyle || 'subtle';
  document.getElementById('theme-font').value = t.font || 'mono';

  // labels
  document.getElementById('label-borderRadius').textContent = `${t.borderRadius || 22}px`;
  document.getElementById('label-gap').textContent = `${t.gap || 10}px`;
}

function fillForm(content) {
  document.getElementById('siteTitle').value = content.site.title;
  document.getElementById('siteSubtitle').value = content.site.subtitle;
  document.getElementById('heroClaim').value = content.site.heroClaim;
  document.getElementById('intro').value = content.site.intro;
  document.getElementById('about').value = content.site.about;
  document.getElementById('email').value = content.site.email;

  buildCardFieldsHTML(content);
  buildProjectFieldsHTML(content);
  buildThemeFieldsHTML(content);
}

window.adminForm = {
  collectFormData,
  buildCardFieldsHTML,
  buildProjectFieldsHTML,
  buildThemeFieldsHTML,
  fillForm
};
