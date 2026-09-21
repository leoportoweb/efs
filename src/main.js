// eFootball Skills Tracker - Main Application
import './style.css';

// State
let skills = [];
let currentLang = 'ptPT';
let currentSort = 'name';
let currentSortDir = 'asc';
let currentFilter = '';
let searchInputValue = ''; // separate from currentFilter
let showOnlyWithCount = false;
let controlsExpanded = false; // collapsible controls
let editingSkillId = null;
let isSaving = false;
let appVersion = '';

// Language labels
const langLabels = {
  en: { code: 'en', label: 'English', native: 'English' },
  ptPT: { code: 'pt-PT', label: 'Português (Portugal)', native: 'Português (Portugal)' },
  ptBR: { code: 'pt-BR', label: 'Português (Brasil)', native: 'Português (Brasil)' }
};

// DOM cache
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Initialize
async function init() {
  await loadSkills();
  loadPreferences();
  render();
  setupEventListeners();
  registerSW();
  setupInstallPrompt();
  setupOfflineDetection();
}

async function loadSkills() {
  try {
    const res = await fetch('/skills.json');
    const data = await res.json();
    skills = data.skills || [];
    appVersion = data.version || '';
  } catch (e) {
    console.error('Failed to load skills:', e);
    skills = [];
  }
}

function loadPreferences() {
  currentLang = localStorage.getItem('efs_lang') || 'ptPT';
  currentSort = localStorage.getItem('efs_sort') || 'name';
  currentSortDir = localStorage.getItem('efs_sortDir') || 'asc';
  currentFilter = localStorage.getItem('efs_filter') || '';
  searchInputValue = localStorage.getItem('efs_searchInput') || '';
  showOnlyWithCount = localStorage.getItem('efs_showOnlyWithCount') === 'true';
  controlsExpanded = localStorage.getItem('efs_controlsExpanded') === 'true';
}

function savePreferences() {
  localStorage.setItem('efs_lang', currentLang);
  localStorage.setItem('efs_sort', currentSort);
  localStorage.setItem('efs_sortDir', currentSortDir);
  localStorage.setItem('efs_filter', currentFilter);
  localStorage.setItem('efs_searchInput', searchInputValue);
  localStorage.setItem('efs_showOnlyWithCount', showOnlyWithCount);
  localStorage.setItem('efs_controlsExpanded', controlsExpanded);
}

async function saveSkills() {
  if (isSaving) return;
  isSaving = true;
  try {
    await fetch('/api/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills })
    });
  } catch (e) {
    console.error('Failed to save skills:', e);
    showToast('Erro ao salvar dados no servidor', 'error');
  } finally {
    isSaving = false;
  }
}

function getSkillName(skill) {
  return skill.names[currentLang] || skill.names.en;
}

function getNextId() {
  return skills.length ? Math.max(...skills.map(s => s.id)) + 1 : 1;
}

function getFilteredSortedSkills() {
  let result = [...skills];

  if (currentFilter) {
    const q = currentFilter.toLowerCase();
    result = result.filter(s => getSkillName(s).toLowerCase().includes(q));
  }

  if (showOnlyWithCount) {
    result = result.filter(s => s.count > 0);
  }

  result.sort((a, b) => {
    let comparison = 0;
    if (currentSort === 'name') {
      comparison = getSkillName(a).localeCompare(getSkillName(b), currentLang === 'en' ? 'en' : 'pt');
    } else if (currentSort === 'count') {
      comparison = a.count - b.count;
    }
    return currentSortDir === 'asc' ? comparison : -comparison;
  });

  return result;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function render() {
  const filtered = getFilteredSortedSkills();
  const total = skills.reduce((sum, s) => sum + s.count, 0);

  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header" role="banner">
      <div class="header-inner">
        <div class="header-top">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>eFootball Skills</span>
          </div>
          <div class="header-actions">
            <div class="total-badge" aria-live="polite">${total.toLocaleString()} total</div>
            <button class="controls-toggle" id="controls-toggle" aria-expanded="${controlsExpanded}" aria-controls="controls-panel" aria-label="${controlsExpanded ? 'Ocultar filtros e ordenação' : 'Mostrar filtros e ordenação'}">
              <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                ${controlsExpanded ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' : '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>'}
              </svg>
            </button>
          </div>
        </div>

        <!-- Collapsible Controls Panel -->
        <div class="controls-panel" id="controls-panel" ${controlsExpanded ? '' : 'hidden'}>
          <div class="controls">
            <div class="control-group">
              <label for="lang-select">Idioma</label>
              <select id="lang-select" aria-label="Select language">
                ${Object.entries(langLabels).map(([code, info]) => `
                  <option value="${code}" ${code === currentLang ? 'selected' : ''}>${info.native}</option>
                `).join('')}
              </select>
            </div>

            <div class="control-group search-wrapper">
              <label for="search-input">Buscar por nome</label>
              <div class="search-input-group">
                <input type="search" id="search-input" placeholder="Digite o nome..." value="${escapeHtml(searchInputValue)}" aria-label="Filtrar skills por nome">
                <button class="btn-search" id="btn-search" aria-label="Aplicar filtro">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </div>
            </div>

            <label class="checkbox-wrapper" for="only-with-count">
              <input type="checkbox" id="only-with-count" ${showOnlyWithCount ? 'checked' : ''} aria-label="Show only skills with count > 0">
              <span>Apenas com contagem</span>
            </label>

            <div class="control-group" style="flex: 0 0 auto;">
              <div class="sort-buttons" role="group" aria-label="Sort options">
                <button class="sort-btn ${currentSort === 'name' ? 'active' : ''} ${currentSort === 'name' && currentSortDir === 'desc' ? 'desc' : ''}" data-sort="name" aria-pressed="${currentSort === 'name'}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>
                  <span>Nome</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button class="sort-btn ${currentSort === 'count' ? 'active' : ''} ${currentSort === 'count' && currentSortDir === 'desc' ? 'desc' : ''}" data-sort="count" aria-pressed="${currentSort === 'count'}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                  <span>Qtd</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
              </div>
            </div>

            <button class="btn-add" id="btn-add-skill" aria-label="Adicionar nova habilidade">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Nova habilidade</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="main" role="main">
      ${filtered.length === 0 ? `
        <div class="empty-state" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8.6" y1="8.6" x2="15.4" y2="15.4"/><line x1="15.4" y1="8.6" x2="8.6" y2="15.4"/>
          </svg>
          <h3>Nenhuma habilidade encontrada</h3>
          <p>${currentFilter || showOnlyWithCount ? 'Tente ajustar os filtros ou a busca' : 'Adicione a primeira habilidade para começar'}</p>
        </div>
      ` : `
        <div class="skills-grid" role="list" aria-label="Skills list">
          ${filtered.map(skill => `
            <article class="skill-card" role="listitem" data-id="${skill.id}">
              <div class="skill-menu">
                <button class="menu-btn" data-action="edit" data-id="${skill.id}" aria-label="Editar ${escapeHtml(getSkillName(skill))}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="menu-btn danger" data-action="delete" data-id="${skill.id}" aria-label="Excluir ${escapeHtml(getSkillName(skill))}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
              <div class="skill-header">
                <span class="skill-name">${escapeHtml(getSkillName(skill))}</span>
                <span class="skill-count" aria-label="${skill.count} vezes">${skill.count}</span>
              </div>
              <div class="skill-actions">
                <button class="action-btn inc" data-action="inc" data-id="${skill.id}" ${skill.count >= 999 ? 'disabled' : ''} aria-label="Incrementar">+</button>
                <button class="action-btn dec" data-action="dec" data-id="${skill.id}" ${skill.count <= 0 ? 'disabled' : ''} aria-label="Decrementar">−</button>
              </div>
            </article>
          `).join('')}
        </div>
      `}
    </main>

    <footer class="footer" role="contentinfo">
      <p>eFootball Skills Tracker${appVersion ? ` v${appVersion}` : ''}</p>
    </footer>

    <div class="toast-container" id="toast-container" aria-live="polite"></div>
  `;

  // Re-bind events after render
  setupEventListeners();
}

function setupEventListeners() {
  // Controls toggle
  $('#controls-toggle')?.addEventListener('click', () => {
    controlsExpanded = !controlsExpanded;
    savePreferences();
    render();
  });

  // Language
  $('#lang-select')?.addEventListener('change', e => {
    currentLang = e.target.value;
    savePreferences();
    render();
  });

  // Search input - update searchInputValue but don't filter yet
  const searchInput = $('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchInputValue = e.target.value;
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySearch();
      }
    });
  }

  // Search button
  $('#btn-search')?.addEventListener('click', applySearch);

  // Checkbox filter
  $('#only-with-count')?.addEventListener('change', e => {
    showOnlyWithCount = e.target.checked;
    savePreferences();
    render();
  });

  // Sort buttons
  $$('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sort = btn.dataset.sort;
      if (currentSort === sort) {
        currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort = sort;
        currentSortDir = 'asc';
      }
      savePreferences();
      render();
    });
  });

  // Action buttons (inc/dec)
  $$('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === 'inc') changeCount(id, 1);
      else if (action === 'dec') changeCount(id, -1);
    });
  });

  // Menu buttons (edit/delete) - click for desktop
  $$('.menu-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === 'edit') openEditModal(id);
      else if (action === 'delete') confirmDelete(id);
      closeAllMenus();
    });
  });

  // Mobile: long-press on skill card to open menu
  let longPressTimer = null;
  let longPressCard = null;

  $$('.skill-card').forEach(card => {
    const menu = card.querySelector('.skill-menu');
    if (!menu) return;

    const startLongPress = (e) => {
      // Don't trigger on buttons
      if (e.target.closest('button')) return;
      
      longPressTimer = setTimeout(() => {
        closeAllMenus();
        menu.classList.add('open');
        longPressCard = card;
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(10);
      }, 500);
    };

    const cancelLongPress = () => {
      clearTimeout(longPressTimer);
    };

    // Touch events
    card.addEventListener('touchstart', startLongPress, { passive: true });
    card.addEventListener('touchend', cancelLongPress);
    card.addEventListener('touchmove', cancelLongPress);
    card.addEventListener('touchcancel', cancelLongPress);

    // Mouse events (for desktop long-press too)
    card.addEventListener('mousedown', startLongPress);
    card.addEventListener('mouseup', cancelLongPress);
    card.addEventListener('mouseleave', cancelLongPress);

    // Click outside to close
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-btn') && !e.target.closest('.action-btn')) {
        closeAllMenus();
      }
    });
  });

  function closeAllMenus() {
    $$('.skill-menu.open').forEach(m => m.classList.remove('open'));
  }

  function applySearch() {
    currentFilter = searchInputValue.trim();
    savePreferences();
    render();
  }

  // Add skill button
  $('#btn-add-skill')?.addEventListener('click', () => openEditModal(null));
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function changeCount(id, delta) {
  const skill = skills.find(s => s.id === id);
  if (!skill) return;
  const newCount = Math.max(0, Math.min(999, skill.count + delta));
  if (newCount !== skill.count) {
    skill.count = newCount;
    saveSkills();
    render();
  }
}

function openEditModal(id) {
  editingSkillId = id;
  const skill = id ? skills.find(s => s.id === id) : null;
  const isEdit = !!skill;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">${isEdit ? 'Editar habilidade' : 'Nova habilidade'}</h2>
        <button class="modal-close" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="skill-form">
          <div class="form-group">
            <label for="skill-en">English *</label>
            <input type="text" id="skill-en" name="en" required maxlength="60" value="${escapeHtml(skill?.names.en || '')}" placeholder="e.g., Double Touch">
          </div>
          <div class="form-group">
            <label for="skill-ptPT">Português (Portugal) *</label>
            <input type="text" id="skill-ptPT" name="ptPT" required maxlength="60" value="${escapeHtml(skill?.names.ptPT || '')}" placeholder="e.g., Toque Duplo">
          </div>
          <div class="form-group">
            <label for="skill-ptBR">Português (Brasil) *</label>
            <input type="text" id="skill-ptBR" name="ptBR" required maxlength="60" value="${escapeHtml(skill?.names.ptBR || '')}" placeholder="e.g., Toque duplo">
          </div>
          ${isEdit ? `
            <div class="form-group">
              <label for="skill-count">Contagem inicial</label>
              <input type="number" id="skill-count" name="count" min="0" max="999" value="${skill.count}" style="width: 120px;">
            </div>
          ` : ''}
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button>
        <button type="submit" form="skill-form" class="btn btn-primary" id="modal-save">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          ${isEdit ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('#skill-en').focus();

  const close = () => {
    modal.remove();
    editingSkillId = null;
  };

  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.querySelector('#modal-cancel').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  modal.querySelector('#skill-form').addEventListener('submit', e => {
    e.preventDefault();
    saveSkill(id);
    close();
  });

  // Close on Escape
  const escHandler = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }};
  document.addEventListener('keydown', escHandler);
}

function saveSkill(id) {
  const en = $('#skill-en').value.trim();
  const ptPT = $('#skill-ptPT').value.trim();
  const ptBR = $('#skill-ptBR').value.trim();
  const count = parseInt($('#skill-count')?.value || '0', 10);

  if (!en || !ptPT || !ptBR) {
    showToast('Preencha os três idiomas', 'error');
    return;
  }

  if (id) {
    // Edit
    const skill = skills.find(s => s.id === id);
    if (skill) {
      skill.names = { en, ptPT, ptBR };
      skill.count = Math.max(0, Math.min(999, count));
      showToast('Habilidade atualizada', 'success');
    }
  } else {
    // Add new
    const newSkill = {
      id: getNextId(),
      names: { en, ptPT, ptBR },
      count: 0
    };
    skills.push(newSkill);
    showToast('Habilidade criada', 'success');
  }

  saveSkills();
  render();
}

function confirmDelete(id) {
  const skill = skills.find(s => s.id === id);
  if (!skill) return;

  if (!confirm(`Excluir "${getSkillName(skill)}"? Esta ação não pode ser desfeita.`)) return;

  skills = skills.filter(s => s.id !== id);
  saveSkills();
  render();
  showToast('Habilidade excluída', 'success');
}

function showToast(message, type = 'info') {
  const container = $('#toast-container') || (() => { const c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); return c; })();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Fechar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  container.appendChild(toast);
  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  setTimeout(() => toast.remove(), 3000);
}

// Service Worker Registration
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  }
}

// Install Prompt
let deferredPrompt = null;
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallBanner();
  });
}

function showInstallBanner() {
  if ($('#install-banner') || window.matchMedia('(display-mode: standalone)').match) return;
  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.className = 'install-banner';
  banner.innerHTML = `
    <div class="install-content">
      <div class="install-text">
        <strong>Instalar eFootball Skills</strong>
        <span>Adicione à tela inicial para acesso rápido offline</span>
      </div>
      <div class="install-actions">
        <button class="btn btn-secondary" id="install-dismiss">Agora não</button>
        <button class="btn btn-primary" id="install-accept">Instalar</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
  $('#install-accept').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') deferredPrompt = null;
      hideInstallBanner();
    }
  });
  $('#install-dismiss').addEventListener('click', hideInstallBanner);
}

function hideInstallBanner() {
  $('#install-banner')?.remove();
}

// Offline Detection
function setupOfflineDetection() {
  const indicator = document.createElement('div');
  indicator.className = 'offline-indicator';
  indicator.textContent = 'Você está offline — dados salvos localmente';
  indicator.hidden = true;
  document.body.appendChild(indicator);
  const update = () => indicator.hidden = navigator.onLine;
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

init();