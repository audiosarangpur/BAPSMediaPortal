const CHANNELS = [
    ["@BAPS","BAPS Swaminarayan Sanstha","M3AnuJ1g8Yw","BAPS","#d9782d"], ["@BAPSKirtanChannel","BAPS Kirtan","9S_xK6912Lw","KIR","#8d4aa8"],
    ["@Aksharpith","Aksharpith","W_A649_1Ld8","AKS","#496b9d"], ["@bapsbetterliving","BAPS Better Living","T7yG7e15m88","BET","#2d8a7b"],
    ["@bapscharities","BAPS Charities","yP30L8q4U1k","CHA","#6b78b8"], ["@BAPSsatsang_GUJ","BAPS Satsang Gujarati","d97S3E1S18A","GUJ","#3c8ab8"],
    ["@BAPSSatsang_HIN","BAPS Satsang Hindi","X8M8aW_8A7k","HIN","#3d9c91"], ["@BAPSsatsang_ENG","BAPS Satsang English","J8aA8E0W7A8","ENG","#487f9b"],
    ["@BAPSEvent","BAPS Events","d97S3E1S18A","EVE","#8b6a42"], ["@BAPSKidsWorld","BAPS Kids World","W_A649_1Ld8","KID","#6b9d4a"],
    ["@Swaminarayan_Yatra","Swaminarayan Yatra","d97S3E1S18A","YAT","#71914c"], ["@AkshardhamUSA","Akshardham USA","M3AnuJ1g8Yw","USA","#a29a48"],
    ["@BAPSAmerica","BAPS North America","J8aA8E0W7A8","NAM","#b48a36"], ["@BAPSUKEurope","BAPS UK & Europe","X8M8aW_8A7k","EUR","#b36f38"],
    ["@BAPSCanada","BAPS Canada","d97S3E1S18A","CAN","#9a6540"], ["@BAPSAfrica","BAPS Africa","W_A649_1Ld8","AFR","#a35435"],
    ["@BAPSANZ","BAPS Asia Pacific","9S_xK6912Lw","ANZ","#73594b"], ["@abudhabimandir","BAPS Hindu Mandir Abu Dhabi","M3AnuJ1g8Yw","ABU","#607581"],
    ["@BAPSIndia","BAPS India","X8M8aW_8A7k","IND","#727b84"], ["@bapslive","BAPS Live","9S_xK6912Lw","LIVE","#bf583a"],
    ["@SantParamHitkari","Sant Param Hitkari","W_A649_1Ld8","SPH","#785b9b"]
].map(([handle,name,videoId,tag,color]) => ({handle,name,videoId,tag,color,videos:[],loaded:false}));

const API_KEY = window.BAPS_PORTAL_CONFIG?.YOUTUBE_API_KEY?.trim();
const VIDEOS_PER_CHANNEL = 8;
let loadingPromise = null;

function esc(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function thumb(video) { return video.thumbnail || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }
function dateLabel(date) { if (!date) return ''; return new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric'}).format(new Date(date)); }

function renderSidebar() {
    document.getElementById('sidebar-channels').innerHTML = CHANNELS.map(ch => `<div class="nav-item" onclick="showChannel('${ch.handle}',this)"><div class="channel-avatar" style="background:${ch.color}">${ch.tag}</div><span class="channel-name" title="${esc(ch.name)}">${esc(ch.name)}</span></div>`).join('');
}

function fallbackVideos(ch) {
    return Array.from({length: 6}, (_,i) => ({
        id: ch.videoId,
        title: i === 0 ? `${ch.name} — Latest video` : `${ch.name} — Video ${i + 1}`,
        publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
        thumbnail: `https://img.youtube.com/vi/${ch.videoId}/hqdefault.jpg`,
        channel: ch
    }));
}

async function api(path, params) {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
    Object.entries({...params,key:API_KEY}).forEach(([k,v]) => url.searchParams.set(k,v));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API ${response.status}`);
    return response.json();
}

async function loadChannelVideos(ch) {
    if (!API_KEY) { ch.videos = fallbackVideos(ch); ch.loaded = true; return; }
    try {
        const channelData = await api('channels',{part:'contentDetails',forHandle:ch.handle});
        const channel = channelData.items?.[0];
        if (!channel) throw new Error('Channel not found');
        const uploads = channel.contentDetails.relatedPlaylists.uploads;
        const items = await api('playlistItems',{part:'snippet,contentDetails',playlistId:uploads,maxResults:VIDEOS_PER_CHANNEL});
        ch.videos = items.items.map(item => ({
            id:item.contentDetails.videoId,
            title:item.snippet.title,
            publishedAt:item.contentDetails.videoPublishedAt || item.snippet.publishedAt,
            thumbnail:item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
            channel:ch
        }));
        if (!ch.videos.length) ch.videos = fallbackVideos(ch);
    } catch (error) {
        console.warn(`Could not load ${ch.name}:`, error);
        ch.videos = fallbackVideos(ch);
    }
    ch.loaded = true;
}

async function loadAllVideos() {
    if (loadingPromise) return loadingPromise;
    loadingPromise = Promise.all(CHANNELS.map(loadChannelVideos));
    return loadingPromise;
}

function createCard(video) {
    const ch = video.channel;
    return `<article class="video-card" onclick="openVideo('${video.id}')"><div class="thumb-wrapper" style="background-image:url('${thumb(video)}')"><div class="play-overlay">▶</div></div><div class="card-info"><div class="channel-avatar" style="background:${ch.color}">${ch.tag}</div><div><div class="video-title">${esc(video.title)}</div><div class="video-channel">${esc(ch.name)}${video.publishedAt ? ` · ${dateLabel(video.publishedAt)}` : ''}</div></div></div></article>`;
}

function renderLoading() {
    document.getElementById('home-view').innerHTML = `<div class="home-heading"><div><h1>Home</h1><p>Loading the latest videos from your channels…</p></div></div><div class="portal-loading"><span></span><span></span><span></span></div>`;
}

function renderHome() {
    const allVideos = CHANNELS.flatMap(ch => ch.videos).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const latest = allVideos.slice(0,8);
    const rows = CHANNELS.filter(ch => ch.videos.length).map(ch => ({title:`Latest from ${ch.name}`,channel:ch,videos:ch.videos.slice(0,VIDEOS_PER_CHANNEL)}));
    document.getElementById('home-view').innerHTML = `<div class="home-heading"><div><h1>Home</h1><p>Latest videos from your channels</p></div>${API_KEY ? '' : '<div class="demo-notice">Demo data · Add an API key in config.js for live latest videos</div>'}</div>${latest.length ? rowMarkup('Latest from all channels',latest,null,true) : ''}${rows.map(r => rowMarkup(r.title,r.videos,r.channel)).join('')}`;
}

function rowMarkup(title,videos,ch,first=false) {
    return `<section class="content-row ${first?'content-row-first':''}"><div class="section-heading"><h2>${esc(title)}</h2><button class="view-all-btn" onclick="showAll('${ch?.handle || '__latest'}')">View all <span>›</span></button></div><div class="video-strip">${videos.map(createCard).join('')}</div></section>`;
}

function showHome(element) {
    if (element) setActive(element);
    document.getElementById('search-input').value='';
    document.getElementById('home-view').hidden=false;
    document.getElementById('results-view').hidden=true;
    renderHome();
}

function showAll(handle) {
    if (handle === '__latest') {
        const videos = CHANNELS.flatMap(ch=>ch.videos).sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
        showResults('Latest from all channels',videos,'All recent uploads');
        return;
    }
    const ch = CHANNELS.find(c=>c.handle===handle);
    showResults(ch.name,ch.videos,`${ch.videos.length} recent videos`);
}

function showChannel(handle,element) { setActive(element); const ch=CHANNELS.find(c=>c.handle===handle); showResults(ch.name,ch.videos,`${ch.videos.length} recent videos`); }
function showResults(title,videos,subtitle='') {
    document.getElementById('home-view').hidden=true; document.getElementById('results-view').hidden=false;
    document.getElementById('page-title').textContent=title; document.getElementById('page-subtitle').textContent=subtitle;
    document.getElementById('video-grid').innerHTML=videos.length ? videos.map(createCard).join('') : `<div class="empty-state"><strong>No videos found</strong><span>Try again later.</span></div>`;
    document.getElementById('content-area').scrollTo({top:0,behavior:'smooth'});
}

function filterVideos() {
    const q=document.getElementById('search-input').value.trim().toLowerCase();
    if (!q) return showHome(document.querySelector('.nav-item'));
    const videos=CHANNELS.flatMap(ch=>ch.videos).filter(v=>v.title.toLowerCase().includes(q)||v.channel.name.toLowerCase().includes(q)||v.channel.handle.toLowerCase().includes(q));
    showResults(`Search results for “${q}”`,videos,`${videos.length} ${videos.length===1?'video':'videos'} found`);
}

function openVideo(videoId) { window.open(`https://www.youtube.com/watch?v=${videoId}`,'_blank','noopener'); }
function setActive(element) { document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active')); if(element) element.classList.add('active'); }

window.onload = async () => {
    renderSidebar(); renderLoading();
    await loadAllVideos();
    showHome(document.querySelector('.nav-item'));
};
