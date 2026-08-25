const CHANNELS = [
    { handle: "@BAPS", name: "BAPS Swaminarayan Sanstha", videoId: "M3AnuJ1g8Yw", tag: "BAPS", color: "#d9782d" },
    { handle: "@BAPSKirtanChannel", name: "BAPS Kirtan", videoId: "9S_xK6912Lw", tag: "KIR", color: "#8d4aa8" },
    { handle: "@Aksharpith", name: "Aksharpith", videoId: "W_A649_1Ld8", tag: "AKS", color: "#496b9d" },
    { handle: "@bapsbetterliving", name: "BAPS Better Living", videoId: "T7yG7e15m88", tag: "BET", color: "#2d8a7b" },
    { handle: "@bapscharities", name: "BAPS Charities", videoId: "yP30L8q4U1k", tag: "CHA", color: "#6b78b8" },
    { handle: "@BAPSsatsang_GUJ", name: "BAPS Satsang Gujarati", videoId: "d97S3E1S18A", tag: "GUJ", color: "#3c8ab8" },
    { handle: "@BAPSSatsang_HIN", name: "BAPS Satsang Hindi", videoId: "X8M8aW_8A7k", tag: "HIN", color: "#3d9c91" },
    { handle: "@BAPSsatsang_ENG", name: "BAPS Satsang English", videoId: "J8aA8E0W7A8", tag: "ENG", color: "#487f9b" },
    { handle: "@BAPSEvent", name: "BAPS Events", videoId: "d97S3E1S18A", tag: "EVE", color: "#8b6a42" },
    { handle: "@BAPSKidsWorld", name: "BAPS Kids World", videoId: "W_A649_1Ld8", tag: "KID", color: "#6b9d4a" },
    { handle: "@Swaminarayan_Yatra", name: "Swaminarayan Yatra", videoId: "d97S3E1S18A", tag: "YAT", color: "#71914c" },
    { handle: "@AkshardhamUSA", name: "Akshardham USA", videoId: "M3AnuJ1g8Yw", tag: "USA", color: "#a29a48" },
    { handle: "@BAPSAmerica", name: "BAPS North America", videoId: "J8aA8E0W7A8", tag: "NAM", color: "#b48a36" },
    { handle: "@BAPSUKEurope", name: "BAPS UK & Europe", videoId: "X8M8aW_8A7k", tag: "EUR", color: "#b36f38" },
    { handle: "@BAPSCanada", name: "BAPS Canada", videoId: "d97S3E1S18A", tag: "CAN", color: "#9a6540" },
    { handle: "@BAPSAfrica", name: "BAPS Africa", videoId: "W_A649_1Ld8", tag: "AFR", color: "#a35435" },
    { handle: "@BAPSANZ", name: "BAPS Asia Pacific", videoId: "9S_xK6912Lw", tag: "ANZ", color: "#73594b" },
    { handle: "@abudhabimandir", name: "BAPS Hindu Mandir Abu Dhabi", videoId: "M3AnuJ1g8Yw", tag: "ABU", color: "#607581" },
    { handle: "@BAPSIndia", name: "BAPS India", videoId: "X8M8aW_8A7k", tag: "IND", color: "#727b84" },
    { handle: "@bapslive", name: "BAPS Live", videoId: "9S_xK6912Lw", tag: "LIVE", color: "#bf583a" },
    { handle: "@SantParamHitkari", name: "Sant Param Hitkari", videoId: "W_A649_1Ld8", tag: "SPH", color: "#785b9b" }
];

const HOME_ROWS = [
    { title: "Latest from all channels", channels: CHANNELS.slice(0, 6) },
    { title: "Featured channels", channels: [CHANNELS[0], CHANNELS[1], CHANNELS[2], CHANNELS[3], CHANNELS[8], CHANNELS[9]] },
    { title: "Satsang", channels: [CHANNELS[5], CHANNELS[6], CHANNELS[7], CHANNELS[20], CHANNELS[2], CHANNELS[10]] },
    { title: "Around the world", channels: [CHANNELS[11], CHANNELS[12], CHANNELS[13], CHANNELS[14], CHANNELS[15], CHANNELS[16], CHANNELS[17], CHANNELS[18]] }
];

function renderSidebar() {
    const container = document.getElementById('sidebar-channels');
    container.innerHTML = CHANNELS.map(ch => `
        <div class="nav-item" onclick="showChannel('${ch.handle}', this)">
            <div class="channel-avatar" style="background-color:${ch.color}">${ch.tag}</div>
            <span class="channel-name" title="${ch.name}">${ch.name}</span>
        </div>
    `).join('');
}

function thumbnail(ch) {
    return `https://img.youtube.com/vi/${ch.videoId}/hqdefault.jpg`;
}

function playVideo(element, videoId) {
    element.innerHTML = `<iframe title="Video player" src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function createCard(ch) {
    return `
        <article class="video-card">
            <div class="thumb-wrapper" onclick="playVideo(this, '${ch.videoId}')" style="background-image:url('${thumbnail(ch)}'); cursor:pointer;">
                <div class="play-overlay">▶</div>
            </div>
            <div class="card-info">
                <div class="channel-avatar" style="background-color:${ch.color}">${ch.tag}</div>
                <div>
                    <div class="video-title">${ch.name}</div>
                    <div class="video-channel">${ch.handle}</div>
                </div>
            </div>
        </article>`;
}

function renderHome() {
    const home = document.getElementById('home-view');
    const greeting = `
        <div class="home-heading">
            <div>
                <h1>Home</h1>
                <p>Latest videos from your channels</p>
            </div>
        </div>`;

    home.innerHTML = greeting + HOME_ROWS.map((row, index) => `
        <section class="content-row ${index === 0 ? 'content-row-first' : ''}">
            <div class="section-heading">
                <h2>${row.title}</h2>
                <button class="view-all-btn" onclick="showRow(${index})">View all <span>›</span></button>
            </div>
            <div class="video-strip">
                ${row.channels.map(createCard).join('')}
            </div>
        </section>
    `).join('');
}

function showHome(element) {
    if (element) setActive(element);
    document.getElementById('search-input').value = '';
    document.getElementById('home-view').hidden = false;
    document.getElementById('results-view').hidden = true;
    renderHome();
}

function showRow(index) {
    const row = HOME_ROWS[index];
    document.getElementById('home-view').hidden = true;
    document.getElementById('results-view').hidden = false;
    document.getElementById('page-title').textContent = row.title;
    document.getElementById('video-grid').innerHTML = row.channels.map(createCard).join('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showChannel(handle, element) {
    setActive(element);
    const ch = CHANNELS.find(c => c.handle === handle);
    document.getElementById('search-input').value = '';
    document.getElementById('home-view').hidden = true;
    document.getElementById('results-view').hidden = false;
    document.getElementById('page-title').textContent = ch.name;
    document.getElementById('video-grid').innerHTML = createCard(ch);
}

function filterChannels() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (!query) {
        showHome(document.querySelector('.nav-item'));
        return;
    }

    document.getElementById('home-view').hidden = true;
    document.getElementById('results-view').hidden = false;
    document.getElementById('page-title').textContent = `Search results for “${query}”`;
    const filtered = CHANNELS.filter(ch =>
        ch.name.toLowerCase().includes(query) ||
        ch.handle.toLowerCase().includes(query) ||
        ch.tag.toLowerCase().includes(query)
    );

    document.getElementById('video-grid').innerHTML = filtered.length
        ? filtered.map(createCard).join('')
        : `<div class="empty-state"><strong>No channels found</strong><span>Try a different search.</span></div>`;
}

function setActive(element) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if (element) element.classList.add('active');
}

window.onload = function () {
    renderSidebar();
    showHome(document.querySelector('.nav-item'));
};
