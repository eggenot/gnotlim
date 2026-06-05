let movies = [];
let series = [];
let live = [];

const player = document.getElementById("player");
const list = document.getElementById("list");

/* =========================
   🔐 LOGIN SYSTEM
========================= */
const USER = "admin";
const PASS = "1234";

function login() {
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if (u === USER && p === PASS) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadAll();
  } else {
    document.getElementById("msg").innerText = "❌ Login salah!";
  }
}

/* =========================
   LOAD DATA
========================= */
async function loadAll() {
  movies = await (await fetch("movies.json")).json();
  series = await (await fetch("series.json")).json();
  live = await (await fetch("live.json")).json();

  showMovies();
}

/* =========================
   PLAYER
========================= */
function play(url) {
  player.src = url;
  player.play();
}

/* =========================
   MOVIES (NETFLIX STYLE)
========================= */
function showMovies() {
  list.innerHTML = "";

  movies.forEach(m => {
    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      🎬 ${m.title}<br>
      <button onclick="play('${m.url}')">Play</button>
    `;

    list.appendChild(div);
  });
}

/* =========================
   SERIES (SEASON + EPISODE)
========================= */
function showSeries() {
  list.innerHTML = "";

  series.forEach(s => {
    let div = document.createElement("div");
    div.className = "card";

    let html = `<h3>${s.title}</h3>`;

    s.seasons.forEach(season => {
      html += `<b>Season ${season.season}</b><br>`;

      season.episodes.forEach(ep => {
        html += `<button onclick="play('${ep.url}')">${ep.title}</button>`;
      });
    });

    div.innerHTML = html;
    list.appendChild(div);
  });
}

/* =========================
   LIVE TV (IPTV + JSON)
========================= */
function showLive() {
  list.innerHTML = "";

  live.forEach(l => {
    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      📡 ${l.title}<br>
      <small>${l.group}</small><br>
      <button onclick="play('${l.url}')">Watch</button>
    `;

    list.appendChild(div);
  });
}

/* =========================
   IPTV IMPORT M3U
========================= */
async function importM3U() {
  let url = document.getElementById("m3uUrl").value;

  let res = await fetch(url);
  let text = await res.text();

  let lines = text.split("\n");

  live = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#EXTINF")) {
      let name = lines[i].split(",")[1];
      let link = lines[i + 1];

      live.push({
        title: name,
        url: link,
        group: "IPTV Import"
      });
    }
  }

  showLive();
}

/* =========================
   SEARCH SYSTEM
========================= */
function searchMedia() {
  let q = document.getElementById("search").value.toLowerCase();

  let all = [
    ...movies.map(m => ({ ...m, type: "movie" })),
    ...series.map(s => ({ ...s, type: "series" })),
    ...live.map(l => ({ ...l, type: "live" }))
  ];

  list.innerHTML = "";

  all
    .filter(i => i.title.toLowerCase().includes(q))
    .forEach(i => {
      let div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        ${i.title}<br>
        <button onclick="play('${i.url}')">Play</button>
      `;

      list.appendChild(div);
    });
}
