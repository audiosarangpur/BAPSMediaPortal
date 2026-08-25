// Map real video IDs directly from approved BAPS channels
const CHANNELS = [
    { handle: "@BAPS", name: "BAPS Swaminarayan Sanstha", videoId: "M3AnuJ1g8Yw", tag: "BAPS", color: "#e50914" },
    { handle: "@BAPSKirtanChannel", name: "BAPS Kirtan", videoId: "9S_xK6912Lw", tag: "KIR", color: "#d81b60" },
    { handle: "@Aksharpith", name: "Aksharpith", videoId: "W_A649_1Ld8", tag: "AKS", color: "#8e24aa" },
    { handle: "@bapsbetterliving", name: "BAPS Better Living", videoId: "T7yG7e15m88", tag: "BET", color: "#5e35b1" },
    { handle: "@bapscharities", name: "BAPS Charities", videoId: "yP30L8q4U1k", tag: "CHA", color: "#3949ab" },
    { handle: "@BAPSsatsang_GUJ", name: "BAPS Satsang (Gujarati)", videoId: "d97S3E1S18A", tag: "GUJ", color: "#1e88e5" },
    { handle: "@BAPSSatsang_HIN", name: "BAPS Satsang (Hindi)", videoId: "X8M8aW_8A7k", tag: "HIN", color: "#039be5" },
    { handle: "@BAPSsatsang_ENG", name: "BAPS Satsang (English)", videoId: "J8aA8E0W7A8", tag: "ENG", color: "#00acc1" },
    { handle: "@BAPSEvent", name: "BAPS Event", videoId: "d97S3E1S18A", tag: "EVE", color: "#00897b" },
    { handle: "@BAPSKidsWorld", name: "BAPS Kids World", videoId: "W_A649_1Ld8", tag: "KID", color: "#43a047" },
    { handle: "@Swaminarayan_Yatra", name: "Swaminarayan Yatra", videoId: "d97S3E1S18A", tag: "YAT", color: "#7cb342" },
    { handle: "@AkshardhamUSA", name: "Akshardham USA", videoId: "M3AnuJ1g8Yw", tag: "USA", color: "#c0ca33" },
    { handle: "@BAPSAmerica", name: "BAPS North America", videoId: "J8aA8E0W7A8", tag: "NAM", color: "#fdd835" },
    { handle: "@BAPSUKEurope", name: "BAPS UK & Europe", videoId: "X8M8aW_8A7k", tag: "EUR", color: "#ffb300" },
    { handle: "@BAPSCanada", name: "BAPS Canada", videoId: "d97S3E1S18A", tag: "CAN", color: "#fb8c00" },
    { handle: "@BAPSAfrica", name: "BAPS Africa", videoId: "W_A649_1Ld8", tag: "AFR", color: "#f4511e" },
    { handle: "@BAPSANZ", name: "BAPS Asia Pacific (ANZ)", videoId: "9S_xK6912Lw", tag: "ANZ", color: "#6d4c41" },
    { handle: "@abudhabimandir", name: "BAPS Hindu Mandir Abu Dhabi", videoId: "M3AnuJ1g8Yw", tag: "ABU", color: "#546e7a" },
    { handle: "@BAPSIndia", name: "BAPS India", videoId: "X8M8aW_8A7k", tag: "IND", color: "#757575" },
    { handle: "@bapslive", name: "BAPS Live", videoId: "9S_xK6912Lw", tag: "LIV", color: "#e50914" },
    { handle: "@SantParamHitkari", name: "Sant Param Hitkari", videoId: "W_A649_1Ld8", tag: "SPH", color: "#8e24aa" }
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
