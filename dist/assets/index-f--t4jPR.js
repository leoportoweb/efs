(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function o(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=o(a);fetch(a.href,i)}})();let r=[],w="ptPT",v="name",h="asc",x="",C="",k=!1,m=!1,B=!1,P=!1,N="3.0.2";const O={en:{code:"en",label:"English",native:"English"},ptPT:{code:"pt-PT",label:"Português (Portugal)",native:"Português (Portugal)"},ptBR:{code:"pt-BR",label:"Português (Brasil)",native:"Português (Brasil)"}},d=(e,t=document)=>t.querySelector(e),_=(e,t=document)=>[...t.querySelectorAll(e)];async function D(){await H(),A(),c(),j(),z(),J(),Q()}async function H(){P=!1;{console.error("Supabase not configured"),P=!0,r=[];return}}function A(){w=localStorage.getItem("efs_lang")||"ptPT",v=localStorage.getItem("efs_sort")||"name",h=localStorage.getItem("efs_sortDir")||"asc",x=localStorage.getItem("efs_filter")||"",C=localStorage.getItem("efs_searchInput")||"",k=localStorage.getItem("efs_showOnlyWithCount")==="true",m=localStorage.getItem("efs_controlsExpanded")==="true"}function L(){localStorage.setItem("efs_lang",w),localStorage.setItem("efs_sort",v),localStorage.setItem("efs_sortDir",h),localStorage.setItem("efs_filter",x),localStorage.setItem("efs_searchInput",C),localStorage.setItem("efs_showOnlyWithCount",k),localStorage.setItem("efs_controlsExpanded",m)}async function I(){if(B)return!1;B=!0;let e=!1;try{const t=await fetch("/api/skills",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({skills:r,version:N,updated:new Date().toISOString()})});t.ok?(console.log("Skills updated via API"),e=!0):console.error("API save failed with status:",t.status)}catch(t){console.warn("API save failed (network error), trying direct Supabase:",t)}return B=!1,e||$("Erro ao salvar dados no Supabase","error"),e}function b(e){return e.names[w]||e.names.en}function F(){return r.length?Math.max(...r.map(e=>e.id))+1:1}function R(){let e=[...r];if(x){const t=x.toLowerCase();e=e.filter(o=>b(o).toLowerCase().includes(t))}return k&&(e=e.filter(t=>t.count>0)),e.sort((t,o)=>{let n=0;return v==="name"?n=b(t).localeCompare(b(o),w==="en"?"en":"pt"):v==="count"&&(n=t.count-o.count),h==="asc"?n:-n}),e}function g(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function c(){const e=R(),t=r.reduce((n,a)=>n+a.count,0),o=document.getElementById("app");o.innerHTML=`
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
            <div class="total-badge" aria-live="polite">${t.toLocaleString()} total</div>
            <button class="controls-toggle" id="controls-toggle" aria-expanded="${m}" aria-controls="controls-panel" aria-label="${m?"Ocultar filtros e ordenação":"Mostrar filtros e ordenação"}">
              <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                ${m?'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>':'<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>'}
              </svg>
            </button>
          </div>
        </div>

        <!-- Collapsible Controls Panel -->
        <div class="controls-panel" id="controls-panel" ${m?"":"hidden"}>
          <div class="controls">
            <div class="control-group">
              <label for="lang-select">Idioma</label>
              <select id="lang-select" aria-label="Select language">
                ${Object.entries(O).map(([n,a])=>`
                  <option value="${n}" ${n===w?"selected":""}>${a.native}</option>
                `).join("")}
              </select>
            </div>

            <div class="control-group search-wrapper">
              <label for="search-input">Buscar por nome</label>
              <div class="search-input-group">
                <input type="search" id="search-input" placeholder="Digite o nome..." value="${g(C)}" aria-label="Filtrar skills por nome">
                <button class="btn-search" id="btn-search" aria-label="Aplicar filtro">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </div>
            </div>

            <label class="checkbox-wrapper" for="only-with-count">
              <input type="checkbox" id="only-with-count" ${k?"checked":""} aria-label="Show only skills with count > 0">
              <span>Apenas com contagem</span>
            </label>

            <div class="control-group" style="flex: 0 0 auto;">
              <div class="sort-buttons" role="group" aria-label="Sort options">
                <button class="sort-btn ${v==="name"?"active":""} ${v==="name"&&h==="desc"?"desc":""}" data-sort="name" aria-pressed="${v==="name"}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>
                  <span>Nome</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button class="sort-btn ${v==="count"?"active":""} ${v==="count"&&h==="desc"?"desc":""}" data-sort="count" aria-pressed="${v==="count"}">
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
      ${e.length===0?`
        <div class="empty-state" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8.6" y1="8.6" x2="15.4" y2="15.4"/><line x1="15.4" y1="8.6" x2="8.6" y2="15.4"/>
          </svg>
          <h3>${P?"Erro na conexão com a base de dados":"Nenhuma habilidade encontrada"}</h3>
          <p>${P?"Não foi possível conectar ao Supabase.":x||k?"Tente ajustar os filtros ou a busca":"Adicione a primeira habilidade para começar"}</p>
        </div>
      `:`
        <div class="skills-grid" role="list" aria-label="Skills list">
          ${e.map(n=>`
            <article class="skill-card" role="listitem" data-id="${n.id}">
              <div class="skill-menu">
                <button class="menu-btn" data-action="edit" data-id="${n.id}" aria-label="Editar ${g(b(n))}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="menu-btn danger" data-action="delete" data-id="${n.id}" aria-label="Excluir ${g(b(n))}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
              <div class="skill-header">
                <span class="skill-name">${g(b(n))}</span>
                <span class="skill-count" aria-label="${n.count} vezes">${n.count}</span>
              </div>
              <div class="skill-actions">
                <button class="action-btn inc" data-action="inc" data-id="${n.id}" ${n.count>=999?"disabled":""} aria-label="Incrementar">+</button>
                <button class="action-btn dec" data-action="dec" data-id="${n.id}" ${n.count<=0?"disabled":""} aria-label="Decrementar">−</button>
              </div>
            </article>
          `).join("")}
        </div>
      `}
    </main>

    <footer class="footer" role="contentinfo">
      <p>eFootball Skills Tracker v${N}</p>
    </footer>

    <div class="toast-container" id="toast-container" aria-live="polite"></div>
  `}function j(){var l,f;const e=d("#app");e.addEventListener("click",s=>{if(s.target.closest("#controls-toggle")){m=!m,L(),c();return}if(s.target.closest("#btn-search")){i();return}if(s.target.closest("#btn-add-skill")){q(null);return}const u=s.target.closest(".action-btn");if(u){const E=parseInt(u.dataset.id),S=u.dataset.action;S==="inc"?M(E,1):S==="dec"&&M(E,-1);return}const p=s.target.closest(".menu-btn");if(p){s.stopPropagation();const E=parseInt(p.dataset.id),S=p.dataset.action;S==="edit"?q(E):S==="delete"&&W(E),a();return}s.target.closest(".skill-menu")||a()}),(l=d("#lang-select"))==null||l.addEventListener("change",s=>{w=s.target.value,L(),c()});const t=d("#search-input");t&&(t.addEventListener("input",s=>{C=s.target.value}),t.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),i())})),(f=d("#only-with-count"))==null||f.addEventListener("change",s=>{k=s.target.checked,L(),c()}),e.addEventListener("click",s=>{const u=s.target.closest(".sort-btn");if(u){const p=u.dataset.sort;v===p?h=h==="asc"?"desc":"asc":(v=p,h="asc"),L(),c()}});let o=null;e.addEventListener("touchstart",s=>{const u=s.target.closest(".skill-card");if(!u||s.target.closest("button"))return;const p=u.querySelector(".skill-menu");p&&(o=setTimeout(()=>{a(),p.classList.add("open"),navigator.vibrate&&navigator.vibrate(10)},500))},{passive:!0});const n=()=>clearTimeout(o);e.addEventListener("touchend",n),e.addEventListener("touchmove",n),e.addEventListener("touchcancel",n),e.addEventListener("mousedown",s=>{const u=s.target.closest(".skill-card");if(!u||s.target.closest("button"))return;const p=u.querySelector(".skill-menu");p&&(o=setTimeout(()=>{a(),p.classList.add("open")},500))}),e.addEventListener("mouseup",n),e.addEventListener("mouseleave",n);function a(){_(".skill-menu.open").forEach(s=>s.classList.remove("open"))}function i(){x=C.trim(),L(),c()}}function M(e,t){const o=r.find(i=>i.id===e);if(!o)return;const n=o.count,a=Math.max(0,Math.min(999,o.count+t));a!==o.count&&(o.count=a,I().then(i=>{i||(o.count=n),c()}))}function q(e){const t=e?r.find(l=>l.id===e):null,o=!!t,n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">${o?"Editar habilidade":"Nova habilidade"}</h2>
        <button class="modal-close" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="skill-form">
          <div class="form-group">
            <label for="skill-en">English *</label>
            <input type="text" id="skill-en" name="en" required maxlength="60" value="${g((t==null?void 0:t.names.en)||"")}" placeholder="e.g., Double Touch">
          </div>
          <div class="form-group">
            <label for="skill-ptPT">Português (Portugal) *</label>
            <input type="text" id="skill-ptPT" name="ptPT" required maxlength="60" value="${g((t==null?void 0:t.names.ptPT)||"")}" placeholder="e.g., Toque Duplo">
          </div>
          <div class="form-group">
            <label for="skill-ptBR">Português (Brasil) *</label>
            <input type="text" id="skill-ptBR" name="ptBR" required maxlength="60" value="${g((t==null?void 0:t.names.ptBR)||"")}" placeholder="e.g., Toque duplo">
          </div>
          ${o?`
            <div class="form-group">
              <label for="skill-count">Contagem inicial</label>
              <input type="number" id="skill-count" name="count" min="0" max="999" value="${t.count}" style="width: 120px;">
            </div>
          `:""}
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button>
        <button type="submit" form="skill-form" class="btn btn-primary" id="modal-save">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          ${o?"Salvar":"Criar"}
        </button>
      </div>
    </div>
  `,document.body.appendChild(n),n.querySelector("#skill-en").focus();const a=()=>{n.remove()};n.querySelector(".modal-close").addEventListener("click",a),n.querySelector("#modal-cancel").addEventListener("click",a),n.addEventListener("click",l=>{l.target===n&&a()}),n.querySelector("#skill-form").addEventListener("submit",l=>{l.preventDefault(),V(e),a()});const i=l=>{l.key==="Escape"&&(a(),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i)}function V(e){var i;const t=d("#skill-en").value.trim(),o=d("#skill-ptPT").value.trim(),n=d("#skill-ptBR").value.trim(),a=parseInt(((i=d("#skill-count"))==null?void 0:i.value)||"0",10);if(!t||!o||!n){$("Preencha os três idiomas","error");return}if(e){const l=r.find(f=>f.id===e);if(l){l.names={en:t,ptPT:o,ptBR:n};const f=l.count;l.count=Math.max(0,Math.min(999,a)),I().then(s=>{if(!s){l.count=f,c();return}$("Habilidade atualizada","success"),c()});return}}else{const l={id:F(),names:{en:t,ptPT:o,ptBR:n},count:0};r.push(l),I().then(f=>{if(!f){r=r.filter(s=>s.id!==l.id),c();return}$("Habilidade criada","success"),c()});return}}function W(e){const t=r.find(o=>o.id===e);t&&confirm(`Excluir "${b(t)}"? Esta ação não pode ser desfeita.`)&&(r=r.filter(o=>o.id!==e),I(),c(),$("Habilidade excluída","success"))}function $(e,t="info"){const o=d("#toast-container")||(()=>{const a=document.createElement("div");return a.id="toast-container",a.className="toast-container",document.body.appendChild(a),a})(),n=document.createElement("div");n.className=`toast ${t}`,n.innerHTML=`
    <span class="toast-message">${g(e)}</span>
    <button class="toast-close" aria-label="Fechar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `,o.appendChild(n),n.querySelector(".toast-close").addEventListener("click",()=>n.remove()),setTimeout(()=>n.remove(),3e3)}function z(){"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").catch(console.error)}let y=null;function J(){window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),y=e,K()}),window.addEventListener("appinstalled",()=>{y=null,T()})}function K(){if(d("#install-banner")||window.matchMedia("(display-mode: standalone)").match)return;const e=document.createElement("div");e.id="install-banner",e.className="install-banner",e.innerHTML=`
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
  `,document.body.appendChild(e),d("#install-accept").addEventListener("click",async()=>{if(y){y.prompt();const{outcome:t}=await y.userChoice;t==="accepted"&&(y=null),T()}}),d("#install-dismiss").addEventListener("click",T)}function T(){var e;(e=d("#install-banner"))==null||e.remove()}function Q(){const e=document.createElement("div");e.className="offline-indicator",e.textContent="Você está offline — dados salvos localmente",e.hidden=!0,document.body.appendChild(e);const t=()=>e.hidden=navigator.onLine;window.addEventListener("online",t),window.addEventListener("offline",t),t()}D();
