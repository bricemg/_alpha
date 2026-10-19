// Admin authentication and initialization

(function () {
  const { ADMIN_SECRET, getContent, saveContent } = window.storageUtils;
  const { collectFormData, fillForm } = window.adminForm;

  function showAdmin() {
    document.getElementById('authPanel').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
  }

  function applyTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg || '#e3e3e3');
    root.style.setProperty('--cell', theme.cell || '#f0f0f0');
    root.style.setProperty('--hair', theme.hair || '#d8d8d8');
    root.style.setProperty('--ink', theme.ink || '#2e2e2e');
    root.style.setProperty('--ink-soft', theme.inkSoft || '#585858');
    root.style.setProperty('--red', theme.red || '#d71921');
    root.style.setProperty('--r', `${theme.borderRadius || 22}px`);
    root.style.setProperty('--gap', `${theme.gap || 10}px`);
    // font
    if (theme.font === 'dot') root.style.setProperty('--dot', "'Doto', ui-monospace, monospace");
    else if (theme.font === 'mono') root.style.setProperty('--mono', "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace");
    // sizes
    root.style.setProperty('--base-font-size', `${theme.textSize || 12}px`);
    // layout class on sheet
    const sheet = document.querySelector('.sheet');
    if (sheet) {
      sheet.classList.remove('layout-grid','layout-bento','layout-metro','layout-masonry');
      sheet.classList.add(`layout-${theme.layout || 'grid'}`);
    }
    // card shadow & border style
    if (theme.cardShadow) document.documentElement.classList.add('theme-card-shadow');
    else document.documentElement.classList.remove('theme-card-shadow');

    document.documentElement.setAttribute('data-border-style', theme.borderStyle || 'subtle');
  }

  function saveFromForm() {
    const content = getContent();
    const next = collectFormData(content);

    if (saveContent(next)) {
      const message = document.getElementById('saveMessage');
      message.classList.remove('hidden');
      setTimeout(() => {
        message.classList.add('hidden');
      }, 2000);
    } else {
      alert('Erreur lors de la sauvegarde.');
    }
  }

  function resetContent() {
    if (confirm('Êtes-vous sûr? Cela réinitialisera tout le contenu.')) {
      localStorage.removeItem(window.storageUtils.STORAGE_KEY);
      location.reload();
    }
  }

  // Export JSON
  function exportJSON() {
    const content = getContent();
    const data = JSON.stringify(content, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bricemg_content.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Import JSON
  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
        if (confirm('Importer remplacera le contenu actuel. Continuer ?')) {
          saveContent(parsed);
          location.reload();
        }
      } catch (err) {
        alert('Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  }

  // Live preview handlers
  function attachPreviewHandlers() {
    const themeInputs = document.querySelectorAll('#themeContainer input, #themeContainer select');
    themeInputs.forEach(el => {
      el.addEventListener('input', () => {
        const temp = collectFormData(getContent()).theme;
        applyTheme(temp);
        // update labels for ranges
        if (el.id === 'theme-borderRadius') document.getElementById('label-borderRadius').textContent = `${el.value}px`;
        if (el.id === 'theme-gap') document.getElementById('label-gap').textContent = `${el.value}px`;
      });
    });
  }

  // Presets
  const PRESETS = {
    light: {
      bg:'#e3e3e3', cell:'#f0f0f0', hair:'#d8d8d8', ink:'#2e2e2e', inkSoft:'#585858', red:'#d71921', borderRadius:22, gap:10, layout:'grid', cardShadow:true, borderStyle:'subtle', titleSize:38, t
    },
    dark: {
      bg:'#121212', cell:'#1b1b1b', hair:'#2a2a2a', ink:'#ffffff', inkSoft:'#d0d0d0', red:'#ff5252', borderRadius:18, gap:10, layout:'grid', cardShadow:false, borderStyle:'subtle', titleSize:38, 
    },
    contrast: {
      bg:'#ffffff', cell:'#ffffff', hair:'#000000', ink:'#000000', inkSoft:'#333333', red:'#ff0000', borderRadius:6, gap:8, layout:'bento', cardShadow:true, borderStyle:'strong', titleSize:44, te
    }
  };

  function applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;
    // set inputs
    Object.keys(preset).forEach(k => {
      const el = document.getElementById(`theme-${k}`);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = preset[k];
      else el.value = preset[k];
    });
    const temp = collectFormData(getContent()).theme;
    applyTheme(temp);
  }

  // Event listeners
  document.getElementById('loginBtn').addEventListener('click', () => {
    const value = document.getElementById('secret').value.trim();
    if (value === ADMIN_SECRET) {
      showAdmin();
      const content = getContent();
      fillForm(content);
      // apply initial theme
      applyTheme(content.theme || {});
      // attach preview handlers after form built
      attachPreviewHandlers();
    } else {
      alert('Clé incorrecte.');
    }
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    saveFromForm();
    // re-apply saved theme
    applyTheme(getContent().theme || {});
  });
  document.getElementById('resetBtn').addEventListener('click', resetContent);

  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  document.getElementById('importFile').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importJSON(f);
  });

  document.getElementById('presetLight').addEventListener('click', () => applyPreset('light'));
  document.getElementById('presetDark').addEventListener('click', () => applyPreset('dark'));
  document.getElementById('presetContrast').addEventListener('click', () => applyPreset('contrast'));

  document.getElementById('secret').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('loginBtn').click();
    }
  });
})();
