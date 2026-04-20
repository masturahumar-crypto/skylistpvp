import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, onValue, push, ref, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmiNQnjip_z_0dk9SSeatLd6Mgb666xfU",
  databaseURL: "https://crackedtiers-9ad49-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const SETTINGS_KEY = "skytiers-settings-v2";
const VALUES = {
  HT1: 100,
  LT1: 90,
  HT2: 80,
  LT2: 70,
  HT3: 60,
  LT3: 50,
  HT4: 40,
  LT4: 30,
  HT5: 20,
  LT5: 10
};

const MATRIX_ORDER = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];
const DEFAULT_SETTINGS = {
  compactRows: false,
  compactColumns: false,
  ambientFx: true,
  reducedMotion: false
};

function svgData(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

const ICONS = {
  overall: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#dff7ff"/>
          <stop offset="1" stop-color="#83c8ff"/>
        </linearGradient>
      </defs>
      <path d="M32 8 37.8 22h14.9l-12 8.7 4.6 14.2L32 36.4 18.7 44.9l4.6-14.2-12-8.7h14.9z" fill="url(#g)"/>
    </svg>
  `),
  sword: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M51 10 28 33l3 3L54 13zM23 38l3 3-8 8-5 1 1-5z" fill="#dff7ff"/>
      <path d="M20 42 11 33l4-4 9 9z" fill="#7bd0ff"/>
      <path d="M17 26 38 5l5 5-21 21z" fill="#75a9ff"/>
    </svg>
  `),
  axe: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M28 10 36 18 20 54l-6-2z" fill="#ccefff"/>
      <path d="M34 14c8 0 15 6 17 15-6 1-12-1-17-6z" fill="#a6dbff"/>
      <path d="M31 19c-6 5-8 13-5 20-8-1-14-7-15-15 4-4 12-7 20-5z" fill="#75a9ff"/>
    </svg>
  `),
  mace: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="40" cy="20" r="10" fill="#dff7ff"/>
      <path d="M27 31 18 54l-6-2 9-23z" fill="#7bcfff"/>
      <path d="M33 26 19 40l-4-4 14-14z" fill="#75a9ff"/>
    </svg>
  `),
  smp: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M10 28 32 12l22 16v22H10z" fill="#dff7ff"/>
      <path d="M18 30h28v18H18z" fill="#75a9ff"/>
      <path d="M28 36h8v12h-8z" fill="#ccefff"/>
    </svg>
  `),
  uhc: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M32 54 12 35c-8-8-5-21 5-25 6-2 11 0 15 5 4-5 9-7 15-5 10 4 13 17 5 25z" fill="#dff7ff"/>
      <path d="M32 48 17 33c-4-4-3-11 2-14 4-2 8-1 13 5 5-6 9-7 13-5 5 3 6 10 2 14z" fill="#75a9ff"/>
    </svg>
  `),
  pot: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M26 8h12v7H26z" fill="#dff7ff"/>
      <path d="m22 18 20 2-4 24c-.4 4-4 8-8 8s-7.6-4-8-8z" fill="#75a9ff"/>
      <path d="M22 22h20" stroke="#dff7ff" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `),
  crystal: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="m32 8 18 18-18 30L14 26z" fill="#dff7ff"/>
      <path d="m32 8 6 18-6 30-6-30z" fill="#8bbcff"/>
      <path d="M20 26h24" stroke="#75a9ff" stroke-width="3"/>
    </svg>
  `),
  nethop: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M18 16h28l6 10-6 22H18l-6-22z" fill="#dff7ff"/>
      <path d="M23 26h18l3 12H20z" fill="#75a9ff"/>
      <path d="M24 16c1-6 4-10 8-10s7 4 8 10" stroke="#bce7ff" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>
  `),
  diamondsmp: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M18 10h28l4 10-18 34L14 20z" fill="#dff7ff"/>
      <path d="M24 10h16l4 10H20z" fill="#86b8ff"/>
      <path d="M32 20v34" stroke="#75a9ff" stroke-width="3"/>
    </svg>
  `)
};

const TABS = [
  { id: "overall", label: "Overall", emoji: "🌐" },
  { id: "sword", label: "Sword", emoji: "⚔️" },
  { id: "axe", label: "Axe", emoji: "🪓" },
  { id: "mace", label: "Mace", emoji: "🔨" },
  { id: "smp", label: "SMP", emoji: "🏕️" },
  { id: "uhc", label: "UHC", emoji: "❤" },
  { id: "pot", label: "Pot", emoji: "🧪" },
  { id: "crystal", label: "Crystal", emoji: "💎" },
  { id: "nethop", label: "Neth Pot", emoji: "⛏️" },
  { id: "diamondsmp", label: "Diamond SMP", emoji: "💠" }
];

const ACTIVE_MODES = TABS.slice(1);
const ACTIVE_MODE_COUNT = ACTIVE_MODES.length;

let database = [];
let currentFilter = "overall";
let currentRegion = "ALL";
let searchTerm = "";
let deleteSearchTerm = "";
let settings = loadSettings();

const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const deleteSearchInput = document.getElementById("deleteSearchInput");
const adminStatus = document.getElementById("adminStatus");
const tierInputs = document.getElementById("tierInputs");
const shootingStars = document.getElementById("shootingStars");

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatRegion(region = "GLOBAL") {
  return String(region || "GLOBAL").trim().toUpperCase() || "GLOBAL";
}

function normalizeName(name = "") {
  return String(name).trim().toLowerCase();
}

function getPlayerTier(player, modeId) {
  const value = player?.tiers?.[modeId];
  return Object.prototype.hasOwnProperty.call(VALUES, value) ? value : "";
}

function getScore(player) {
  return ACTIVE_MODES.reduce((sum, tab) => sum + (VALUES[getPlayerTier(player, tab.id)] || 0), 0);
}

function getModeCoverage(player) {
  return ACTIVE_MODES.filter((tab) => Boolean(getPlayerTier(player, tab.id))).length;
}

function getTabScore(player, tabId) {
  if (tabId === "overall") return getScore(player);
  return VALUES[getPlayerTier(player, tabId)] || 0;
}

function getRankTitle(rank, player) {
  if (rank === 1) return "Horizon Challenger";
  if (rank <= 5) return "Sky Breakers";
  return player?.title || "Sky Contender";
}

function getFilterMeta(id) {
  return TABS.find((tab) => tab.id === id) || TABS[0];
}

function iconFor(modeId) {
  return ICONS[modeId] || ICONS.overall;
}

function regionClass(region) {
  const normalized = formatRegion(region);
  if (normalized === "NA") return "region-na";
  if (normalized === "EU") return "region-eu";
  if (normalized === "ASIA" || normalized === "AS") return "region-as";
  return "region-global";
}

function applySettings() {
  document.body.classList.toggle("compact-rows", settings.compactRows);
  document.body.classList.toggle("compact-columns", settings.compactColumns);
  document.body.classList.toggle("ambient-off", !settings.ambientFx);
  document.body.classList.toggle("reduced-motion", settings.reducedMotion);

  document.getElementById("settingCompactRows").checked = settings.compactRows;
  document.getElementById("settingCompactColumns").checked = settings.compactColumns;
  document.getElementById("settingAmbientFx").checked = settings.ambientFx;
  document.getElementById("settingReducedMotion").checked = settings.reducedMotion;
}

function setStatus(message = "", tone = "") {
  adminStatus.textContent = message;
  adminStatus.className = `terminal-status ${tone}`.trim();
}

function renderValueMatrix() {
  document.getElementById("valueMatrix").innerHTML = MATRIX_ORDER.map((tier) => `
    <div class="matrix-chip">
      <span>${tier}</span>
      <strong>${VALUES[tier]} PTS</strong>
    </div>
  `).join("");
}

function renderTabs() {
  const tabList = document.getElementById("tabList");
  tabList.innerHTML = TABS.map((tab) => `
    <button class="tab-pill ${tab.id === currentFilter ? "active" : ""}" type="button" data-filter="${tab.id}">
      <span class="tab-icon-shell">
        <img src="${iconFor(tab.id)}" alt="${escapeHtml(tab.label)} icon">
      </span>
      <span>${escapeHtml(tab.label)}</span>
    </button>
  `).join("");

  tabList.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter || "overall";
      renderTabs();
      render();
    });
  });
}

function renderRegionOptions() {
  const builtIns = ["ASIA", "EU", "NA", "GLOBAL"];
  const databaseRegions = database.map((player) => formatRegion(player.region));
  const options = ["ALL", ...new Set([...builtIns, ...databaseRegions])];

  if (!options.includes(currentRegion)) currentRegion = "ALL";

  regionFilter.innerHTML = options.map((region) => `
    <option value="${region}" ${region === currentRegion ? "selected" : ""}>
      ${region === "ALL" ? "ALL REGIONS" : region}
    </option>
  `).join("");
}

function getVisiblePlayers() {
  return [...database]
    .filter((player) => {
      const region = formatRegion(player.region);
      const regionMatch = currentRegion === "ALL" || region === currentRegion;
      const haystack = `${player.name || ""} ${player.title || ""} ${region}`.toLowerCase();
      const searchMatch = !searchTerm || haystack.includes(searchTerm.toLowerCase());
      return regionMatch && searchMatch;
    })
    .sort((a, b) => {
      const scoreDiff = getTabScore(b, currentFilter) - getTabScore(a, currentFilter);
      if (scoreDiff !== 0) return scoreDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
}

function buildModeChip(tab, tierValue, showLabel = false) {
  const active = Boolean(tierValue);
  return `
    <div class="mode-chip ${active ? "mode-chip-active" : "mode-chip-empty"}">
      <span class="mode-icon-shell">
        <img src="${iconFor(tab.id)}" alt="${escapeHtml(tab.label)}">
      </span>
      <span class="mode-copy">
        ${showLabel ? `<span class="mode-label">${escapeHtml(tab.label)}</span>` : ""}
        <span class="mode-tier">${escapeHtml(tierValue || "--")}</span>
      </span>
    </div>
  `;
}

function updateSummary(players) {
  document.getElementById("totalPlayers").textContent = database.length;
  document.getElementById("activeFilterLabel").textContent = getFilterMeta(currentFilter).label;
  document.getElementById("activeRegionLabel").textContent = currentRegion === "ALL" ? "All Regions" : currentRegion;
  document.getElementById("visibleCount").textContent = players.length;
}

function renderChampion(player) {
  const focusMeta = getFilterMeta(currentFilter);
  const selectedTier = currentFilter === "overall"
    ? `${getScore(player)} TOTAL PTS`
    : `${getPlayerTier(player, currentFilter) || "--"} ${focusMeta.label.toUpperCase()}`;

  return `
    <article class="champion-hero" data-profile="${player.id}">
      <div class="champion-tag">#1 Horizon Challenger</div>

      <div class="champion-grid">
        <div class="avatar-shell">
          <img src="https://minotar.net/helm/${encodeURIComponent(player.name)}/128" alt="${escapeHtml(player.name)}">
        </div>

        <div class="champion-copy">
          <div class="pill-row">
            <span class="region-pill ${regionClass(player.region)}">${escapeHtml(formatRegion(player.region))}</span>
            <span class="signal-pill">${escapeHtml(focusMeta.label)} Focus</span>
          </div>
          <h2>${escapeHtml(player.name)}</h2>
          <p class="glow-title">${escapeHtml(getRankTitle(1, player))}</p>

          <div class="metric-grid">
            <div class="metric-tile">
              <span class="metric-label">Sky Score</span>
              <span class="metric-value">${getTabScore(player, currentFilter)}</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Coverage</span>
              <span class="metric-value">${getModeCoverage(player)}/${ACTIVE_MODE_COUNT}</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Selected Scope</span>
              <span class="metric-value">${escapeHtml(selectedTier)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mode-grid">
        ${ACTIVE_MODES.map((tab) => buildModeChip(tab, getPlayerTier(player, tab.id), true)).join("")}
      </div>
    </article>
  `;
}

function renderRows(players) {
  const listContainer = document.getElementById("playerContainer");

  if (players.length <= 1) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <h3>${players.length === 0 ? "No Players Found" : "Only One Player In Scope"}</h3>
        <p>${players.length === 0
          ? "Adjust the region or search filter and skytiers-list will recalculate the visible registry."
          : "The apex slot is filled, so no extra rows are visible under the current filter."}</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = players.slice(1).map((player, index) => {
    const rank = index + 2;
    const ribbonClass = rank === 2 ? "rank-ribbon-2" : rank === 3 ? "rank-ribbon-3" : "rank-ribbon-default";
    const displayTitle = getRankTitle(rank, player);

    return `
      <article class="player-row" data-profile="${player.id}">
        <div class="rank-ribbon ${ribbonClass}">${rank}.</div>
        <div class="row-avatar">
          <img src="https://minotar.net/helm/${encodeURIComponent(player.name)}/64" alt="${escapeHtml(player.name)}">
        </div>
        <div class="row-identity">
          <div class="row-name-line">
            <h3 class="row-name">${escapeHtml(player.name)}</h3>
          </div>
          <div class="row-meta">
            <span class="title-chip">${escapeHtml(displayTitle.toUpperCase())}</span>
            <span class="score-chip">${getTabScore(player, currentFilter)} PTS</span>
          </div>
        </div>
        <div class="row-right">
          <span class="region-pill ${regionClass(player.region)}">${escapeHtml(formatRegion(player.region))}</span>
          <div class="row-modes">
            ${ACTIVE_MODES.map((tab) => buildModeChip(tab, getPlayerTier(player, tab.id))).join("")}
          </div>
        </div>
      </article>
    `;
  }).join("");

  bindProfileTriggers();
}

function renderTierColumns(players) {
  const championSection = document.getElementById("championSection");
  const listContainer = document.getElementById("playerContainer");
  championSection.innerHTML = "";

  const columnPairs = [
    { label: "Tier 1", high: "HT1", low: "LT1" },
    { label: "Tier 2", high: "HT2", low: "LT2" },
    { label: "Tier 3", high: "HT3", low: "LT3" },
    { label: "Tier 4", high: "HT4", low: "LT4" },
    { label: "Tier 5", high: "HT5", low: "LT5" }
  ];

  const buckets = {};
  MATRIX_ORDER.forEach((tier) => {
    buckets[tier] = [];
  });

  players.forEach((player) => {
    const tier = getPlayerTier(player, currentFilter);
    if (tier && buckets[tier]) buckets[tier].push(player);
  });

  listContainer.innerHTML = `
    <div class="tier-legend">
      <span>Key:</span>
      <span class="legend-item"><span class="legend-dot legend-dot-high"></span>High Tier (HT) — White</span>
      <span class="legend-item"><span class="legend-dot legend-dot-low"></span>Low Tier (LT) — Blue</span>
    </div>

    <div class="tier-column-grid">
      ${columnPairs.map((pair) => {
        const playersInColumn = [...buckets[pair.high], ...buckets[pair.low]];
        return `
          <section class="tier-column">
            <header class="tier-column-header">🏆 ${pair.label}</header>
            <div class="tier-column-body">
              ${playersInColumn.length ? playersInColumn.map((player) => {
                const tier = getPlayerTier(player, currentFilter);
                const lowClass = tier.startsWith("LT") ? "tier-value-low" : "";
                return `
                  <div class="tier-row" data-profile="${player.id}">
                    <img class="tier-avatar" src="https://minotar.net/helm/${encodeURIComponent(player.name)}/32" alt="${escapeHtml(player.name)}">
                    <span class="tier-name">${escapeHtml(player.name)}</span>
                    <span class="tier-value ${lowClass}">${escapeHtml(tier)}</span>
                  </div>
                `;
              }).join("") : `<div class="tier-empty">Empty</div>`}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;

  bindProfileTriggers();
}

function bindProfileTriggers() {
  document.querySelectorAll("[data-profile]").forEach((node) => {
    node.addEventListener("click", () => openProfile(node.dataset.profile || ""));
  });
}

function renderDeleteRoster() {
  const deleteRoster = document.getElementById("deleteRoster");

  const filteredPlayers = [...database]
    .filter((player) => {
      const haystack = `${player.name || ""} ${player.title || ""} ${formatRegion(player.region)}`.toLowerCase();
      return !deleteSearchTerm || haystack.includes(deleteSearchTerm.toLowerCase());
    })
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));

  if (!filteredPlayers.length) {
    deleteRoster.innerHTML = `<div class="delete-empty">No matching players found in the live registry.</div>`;
    return;
  }

  deleteRoster.innerHTML = filteredPlayers.map((player) => `
    <article class="delete-card">
      <div class="delete-copy">
        <p class="delete-name">${escapeHtml(player.name)}</p>
        <p class="delete-meta">
          ${escapeHtml((player.title || "Sky Contender").toUpperCase())}<br>
          ${escapeHtml(formatRegion(player.region))} • ${getScore(player)} pts • ${getModeCoverage(player)}/${ACTIVE_MODE_COUNT} modes
        </p>
      </div>
      <button class="delete-button" data-delete="${player.id}" type="button">Delete</button>
    </article>
  `).join("");

  deleteRoster.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.delete || "";
      const player = database.find((entry) => entry.id === id);
      if (!player) {
        setStatus("Delete failed. Player not found.", "is-error");
        return;
      }

      const confirmed = window.confirm(`Delete ${player.name.toUpperCase()} from skytiers-list?`);
      if (!confirmed) return;

      try {
        await remove(ref(db, `players/${id}`));
        setStatus(`${player.name.toUpperCase()} removed from the registry.`, "is-success");
      } catch (error) {
        setStatus(`Delete failed: ${error.message}`, "is-error");
      }
    });
  });
}

function render() {
  const players = getVisiblePlayers();
  updateSummary(players);

  const championSection = document.getElementById("championSection");
  if (currentFilter === "overall") {
    championSection.innerHTML = players.length ? renderChampion(players[0]) : `
      <div class="empty-state">
        <h3>Registry Clear</h3>
        <p>No players match the current filters. Reset the deck or broaden the search to bring skytiers-list back online.</p>
      </div>
    `;
    bindProfileTriggers();
    renderRows(players);
  } else {
    renderTierColumns(players);
  }

  renderDeleteRoster();
}

function collectDraftPlayer() {
  const name = document.getElementById("pName").value.trim() || "Awaiting IGN";
  const region = formatRegion(document.getElementById("pRegion").value.trim() || "GLOBAL");
  const title = document.getElementById("pTitle").value.trim() || "Sky Contender";
  const tiers = {};

  ACTIVE_MODES.forEach((tab) => {
    const input = document.getElementById(`tier-${tab.id}`);
    const value = input?.value || "";
    if (value) tiers[tab.id] = value;
  });

  return { name, region, title, tiers };
}

function updateDraftSummary() {
  const draft = collectDraftPlayer();
  const previewName = draft.name === "Awaiting IGN" ? "Steve" : draft.name;
  document.getElementById("draftAvatar").src = `https://minotar.net/helm/${encodeURIComponent(previewName)}/128`;
  document.getElementById("draftName").textContent = draft.name.toUpperCase();
  document.getElementById("draftRegion").textContent = draft.region;
  document.getElementById("draftTitle").textContent = draft.title.toUpperCase();
  document.getElementById("draftScore").textContent = `${getScore(draft)} Projected Score`;
  document.getElementById("draftModeCount").textContent = `${getModeCoverage(draft)}/${ACTIVE_MODE_COUNT} Modes Calibrated`;
}

function buildTierInputs() {
  tierInputs.innerHTML = ACTIVE_MODES.map((tab) => `
    <div class="tier-select-card">
      <label class="field-label" for="tier-${tab.id}">${escapeHtml(tab.label)}</label>
      <select id="tier-${tab.id}" class="terminal-select">
        <option value="">${escapeHtml(tab.label)}</option>
        ${Object.keys(VALUES).map((value) => `<option value="${value}">${value} • ${VALUES[value]} pts</option>`).join("")}
      </select>
    </div>
  `).join("");

  ACTIVE_MODES.forEach((tab) => {
    document.getElementById(`tier-${tab.id}`).addEventListener("change", updateDraftSummary);
  });
}

function resetAdminForm(statusMessage = "Draft cleared. Terminal is ready for the next player.", tone = "") {
  document.getElementById("pName").value = "";
  document.getElementById("pRegion").value = "";
  document.getElementById("pTitle").value = "";
  ACTIVE_MODES.forEach((tab) => {
    const field = document.getElementById(`tier-${tab.id}`);
    if (field) field.value = "";
  });
  if (statusMessage) setStatus(statusMessage, tone);
  updateDraftSummary();
}

async function upsertPlayerFromPanel() {
  const name = document.getElementById("pName").value.trim();
  const region = formatRegion(document.getElementById("pRegion").value.trim() || "GLOBAL");
  const title = document.getElementById("pTitle").value.trim() || "Sky Contender";

  if (!name) {
    setStatus("IGN required. The registry cannot sync an unnamed player.", "is-error");
    return;
  }

  const tiers = {};
  ACTIVE_MODES.forEach((tab) => {
    const value = document.getElementById(`tier-${tab.id}`).value;
    if (value) tiers[tab.id] = value;
  });

  const existing = database.find((player) => normalizeName(player.name) === normalizeName(name));

  try {
    if (existing) {
      await update(ref(db, `players/${existing.id}`), {
        name,
        region,
        title,
        tiers: { ...(existing.tiers || {}), ...tiers }
      });
      resetAdminForm(`Player ${name.toUpperCase()} merged into the registry.`, "is-success");
    } else {
      await push(ref(db, "players"), { name, region, title, tiers });
      resetAdminForm(`Player ${name.toUpperCase()} added to the registry.`, "is-success");
    }
  } catch (error) {
    setStatus(`Save failed: ${error.message}`, "is-error");
  }
}

function openModal(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id)?.classList.add("hidden");
}

function openProfile(id) {
  const player = database.find((entry) => entry.id === id);
  if (!player) return;

  const visiblePlayers = getVisiblePlayers();
  const rank = visiblePlayers.findIndex((entry) => entry.id === id) + 1;
  const title = getRankTitle(rank, player);

  document.getElementById("modalAvatar").src = `https://minotar.net/helm/${encodeURIComponent(player.name)}/128`;
  document.getElementById("modalName").textContent = player.name;
  document.getElementById("modalRegion").textContent = formatRegion(player.region);
  document.getElementById("modalTitleDisplay").textContent = title.toUpperCase();
  document.getElementById("modalPoints").textContent = `${getScore(player)} Total Rating`;
  document.getElementById("modalCoverage").textContent = `${getModeCoverage(player)} / ${ACTIVE_MODE_COUNT} Modes Calibrated`;

  document.getElementById("modalTiersGrid").innerHTML = ACTIVE_MODES.map((tab) => {
    const tierValue = getPlayerTier(player, tab.id);
    const points = VALUES[tierValue] || 0;
    return `
      <div class="modal-tier-card">
        <div class="modal-tier-top">
          <span class="modal-mark"><img src="${iconFor(tab.id)}" alt="${escapeHtml(tab.label)}"></span>
          <span class="modal-tier-points">${tierValue ? `${points} pts` : "Unranked"}</span>
        </div>
        <span class="modal-tier-label">${escapeHtml(tab.label)}</span>
        <div class="modal-tier-value">${escapeHtml(tierValue || "--")}</div>
      </div>
    `;
  }).join("");

  openModal("profileModal");
}

function createShootingStar() {
  if (settings.reducedMotion || !settings.ambientFx) return;
  const star = document.createElement("span");
  star.className = "shooting-star";
  star.style.top = `${8 + Math.random() * 22}%`;
  star.style.right = `${-8 - Math.random() * 8}%`;
  star.style.animationDuration = `${1.4 + Math.random() * 1.1}s`;
  shootingStars.appendChild(star);
  star.addEventListener("animationend", () => star.remove(), { once: true });
}

function bindModalBackdrops() {
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) overlay.classList.add("hidden");
    });
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close || ""));
  });
}

document.getElementById("settingsButton").addEventListener("click", () => openModal("settingsModal"));
document.getElementById("protocolButton").addEventListener("click", () => openModal("protocolModal"));
document.getElementById("adminButton").addEventListener("click", () => openModal("adminModal"));
document.getElementById("finalSaveBtn").addEventListener("click", upsertPlayerFromPanel);
document.getElementById("resetAdminBtn").addEventListener("click", () => resetAdminForm());

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  render();
});

regionFilter.addEventListener("change", (event) => {
  currentRegion = event.target.value;
  render();
});

clearFiltersBtn.addEventListener("click", () => {
  searchTerm = "";
  currentRegion = "ALL";
  currentFilter = "overall";
  searchInput.value = "";
  renderRegionOptions();
  renderTabs();
  render();
});

deleteSearchInput.addEventListener("input", (event) => {
  deleteSearchTerm = event.target.value.trim();
  renderDeleteRoster();
});

["pName", "pRegion", "pTitle"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateDraftSummary);
});

document.getElementById("settingCompactRows").addEventListener("change", (event) => {
  settings.compactRows = event.target.checked;
  saveSettings();
  applySettings();
});

document.getElementById("settingCompactColumns").addEventListener("change", (event) => {
  settings.compactColumns = event.target.checked;
  saveSettings();
  applySettings();
  render();
});

document.getElementById("settingAmbientFx").addEventListener("change", (event) => {
  settings.ambientFx = event.target.checked;
  saveSettings();
  applySettings();
});

document.getElementById("settingReducedMotion").addEventListener("change", (event) => {
  settings.reducedMotion = event.target.checked;
  saveSettings();
  applySettings();
});

document.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName;
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
  if (event.key === "Escape") {
    ["settingsModal", "protocolModal", "adminModal", "profileModal"].forEach(closeModal);
  }
  if (event.key === "/" && !typing) {
    event.preventDefault();
    searchInput.focus();
  }
});

bindModalBackdrops();
buildTierInputs();
renderValueMatrix();
renderRegionOptions();
renderTabs();
applySettings();
updateDraftSummary();
render();

onValue(ref(db, "players"), (snapshot) => {
  const data = snapshot.val();
  database = data
    ? Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .filter((player) => player.name)
    : [];

  renderRegionOptions();
  renderTabs();
  render();
});

createShootingStar();
window.setInterval(createShootingStar, 15000);
