let movies = [];
let series = [];
let live = [];

const player = document.getElementById("player");
const list = document.getElementById("list");
const searchInput = document.getElementById("search");

let favorites = JSON.parse(localStorage.getItem("fav") || "[]");

// LOAD DATA
async function loadAll() {
  movies = await (await fetch("movies.json")).json();
  series = await (await fetch("series.json")).json();
  live = await (await fetch("live.json")).json();

  showMovies();
}

// PLAY
function play(url) {
  player.src = url;
  player.play();
}

// FAVORITE
function toggleFav(item) {
  favorites.push(item);
  localStorage.setItem("fav", JSON.stringify(favorites));
}

// SEARCH
function searchMedia() {
  let q = searchInput.value.toLowerCase();

  let all = [
    ...movies.map(m => ({ ...m, type: "movie" })),
    ...series.map(s => ({ ...s, type: "series" })),
    ...live.map(l => ({ ...l, type: "live" }))
  ];

  list.innerHTML = "";

  all.filter(i => i.title.toLowerCase().includes(q))
     .forEach(renderCard);
}

// RENDER MOVIES
function showMovies() {
  list.innerHTML = "";

  movies.forEach(m => {
    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      🎬 ${m.title}<br>
      <button onclick="play('${m.url}')">Play</button>
      <button onclick='toggleFav(${JSON.stringify(m)})'>❤️</button>
    `;

    list.appendChild(div);
  });
}

// SERIES
function showSeries() {
  list.innerHTML = "";

  series.forEach((s, si) => {
    let div = document.createElement("div");
    div.className = "card";

    let html = `<h3>${s.title}</h3>`;

    s.seasons.forEach(season => {
      html += `<b>Season ${season.season}</b><br>`;

      season.episodes.forEach(ep => {
        html += `
          <button onclick="play('${ep.url}')">
            ${ep.title}
          </button>
        `;
      });
    });

    div.innerHTML = html;
    list.appendChild(div);
  });
}

// LIVE TV + IPTV INPUT
function showLive() {
  list.innerHTML = "";

  live.forEach(l => {
    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      📡 ${l.title}<br>
      <small>${l.group}</small><br>
      <small>${l.epg || ""}</small><br>
      <button onclick="play('${l.url}')">Watch</button>
    `;

    list.appendChild(div);
  });
}

// IMPORT M3U INPUT
async function importM3U() {
  let url = document.getElementById("m3uUrl").value;

  let res = await fetch(url);
  let text = await res.text();

  let lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#EXTINF")) {
      let name = lines[i].split(",")[1];
      let link = lines[i + 1];

      live.push({
        title: name,
        url: link,
        group: "Imported"
      });
    }
  }

  showLive();
}

loadAll();
