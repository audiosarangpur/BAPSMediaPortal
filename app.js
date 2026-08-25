const CHANNELS = [
    { handle: "@BAPS", name: "BAPS Swaminarayan Sanstha", videoId: "M7lc1UVf-VE", tag: "BAPS", color: "#e50914" },
    { handle: "@BAPSKirtanChannel", name: "BAPS Kirtan", videoId: "L_LUpnjgPso", tag: "KIR", color: "#d81b60" },
    { handle: "@Aksharpith", name: "Aksharpith", videoId: "3JZ_D3ELwOQ", tag: "AKS", color: "#8e24aa" },
    { handle: "@bapsbetterliving", name: "BAPS Better Living", videoId: "3JZ_D3ELwOQ", tag: "BET", color: "#5e35b1" },
    { handle: "@bapscharities", name: "BAPS Charities", videoId: "M7lc1UVf-VE", tag: "CHA", color: "#3949ab" },
    { handle: "@BAPSsatsang_GUJ", name: "BAPS Satsang (Gujarati)", videoId: "2Vv-BfVoq4g", tag: "GUJ", color: "#1e88e5" },
    { handle: "@BAPSSatsang_HIN", name: "BAPS Satsang (Hindi)", videoId: "fJ9rUzIMcZQ", tag: "HIN", color: "#039be5" },
    { handle: "@BAPSsatsang_ENG", name: "BAPS Satsang (English)", videoId: "kJQP7kiw5Fk", tag: "ENG", color: "#00acc1" },
    { handle: "@BAPSEvent", name: "BAPS Event", videoId: "M7lc1UVf-VE", tag: "EVE", color: "#00897b" },
    { handle: "@BAPSKidsWorld", name: "BAPS Kids World", videoId: "3JZ_D3ELwOQ", tag: "KID", color: "#43a047" },
    { handle: "@Swaminarayan_Yatra", name: "Swaminarayan Yatra", videoId: "2Vv-BfVoq4g", tag: "YAT", color: "#7cb342" },
    { handle: "@AkshardhamUSA", name: "Akshardham USA", videoId: "L_LUpnjgPso", tag: "USA", color: "#c0ca33" },
    { handle: "@BAPSAmerica", name: "BAPS North America", videoId: "kJQP7kiw5Fk", tag: "NAM", color: "#fdd835" },
    { handle: "@BAPSUKEurope", name: "BAPS UK & Europe", videoId: "fJ9rUzIMcZQ", tag: "EUR", color: "#ffb300" },
    { handle: "@BAPSCanada", name: "BAPS Canada", videoId: "2Vv-BfVoq4g", tag: "CAN", color: "#fb8c00" },
    { handle: "@BAPSAfrica", name: "BAPS Africa", videoId: "3JZ_D3ELwOQ", tag: "AFR", color: "#f4511e" },
    { handle: "@BAPSANZ", name: "BAPS Asia Pacific (ANZ)", videoId: "L_LUpnjgPso", tag: "ANZ", color: "#6d4c41" },
    { handle: "@abudhabimandir", name: "BAPS Hindu Mandir Abu Dhabi", videoId: "M7lc1UVf-VE", tag: "ABU", color: "#546e7a" },
    { handle: "@BAPSIndia", name: "BAPS India", videoId: "fJ9rUzIMcZQ", tag: "IND", color: "#757575" },
    { handle: "@bapslive", name: "BAPS Live", videoId: "L_LUpnjgPso", tag: "LIV", color: "#e50914" },
    { handle: "@SantParamHitkari", name: "Sant Param Hitkari", videoId: "3JZ_D3ELwOQ", tag: "SPH", color: "#8e24aa" }
];

function renderSidebar() {
    const container = document.getElementById('sidebar-channels');
    container.innerHTML = CHANNELS.map(ch => `
        <div class="nav-item" onclick="showChannel('${ch.handle}', this)">
            <div class="channel-avatar" style="background-color: ${ch.color}">${ch.tag}</div>
            <span class="channel-name" title="${ch.name}">${ch.name}</span>
        </div>
    `).join('');
}

function createCard(ch) {
    return `
        <div class="video-card">
            <div class="thumb-wrapper">
                <iframe src="https://www.youtube-nocookie.com/embed/${ch.videoId}?rel=0" allowfullscreen></iframe>
            </div>
            <div class="card-info">
                <div class="channel-avatar" style="background-color: ${ch.color}; width: 28px; height: 28px; font-size: 10px;">${ch.tag}</div>
                <div>
                    <div class="video-title">${ch.name}</div>
                    <div class="video-channel">${ch.handle}</div>
                </div>
            </div>
        </div>
    `;
}

function showHome(element) {
    setActive(element);
    document.getElementById('page-title').innerText = "All Approved Channel Feeds";
    document.getElementById('video-grid').innerHTML = CHANNELS.map(ch => createCard(ch)).join('');
}

function showChannel(handle, element) {
    setActive(element);
    const ch = CHANNELS.find(c => c.handle === handle);
    document.getElementById('page-title').innerText = `${ch.name} (${ch.handle})`;
    document.getElementById('video-grid').innerHTML = createCard(ch);
}

function filterChannels() {
    const query = document.getElementById('search-input').value.toLowerCase();
    document.getElementById('page-title').innerText = `Search Results`;
    const filtered = CHANNELS.filter(ch => ch.name.toLowerCase().includes(query) || ch.handle.toLowerCase().includes(query));
    document.getElementById('video-grid').innerHTML = filtered.map(ch => createCard(ch)).join('');
}

function setActive(element) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if(element) element.classList.add('active');
}

window.onload = function() {
    renderSidebar();
    showHome(document.querySelector('.nav-item'));
};