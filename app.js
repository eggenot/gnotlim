const player = document.getElementById("player");
const list = document.getElementById("list");

let data;

// load JSON (series + movies)
fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    showMenu("series");
  });

/* =========================
   IPTV M3U LOADER (LIVE TV)
========================= */
async function loadM3U(url) {
  const res = await fetch(url);
  const text = await res.text();

  const lines = text.split("\n");
  let channels = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#EXTINF")) {
      let name = lines[i].split(",")[1];
      let link = lines[i + 1];

      channels.push({ title: name, url: link });
    }
  }

  return channels;
}

/* =========================
   MENU SYSTEM
========================= */
function showMenu(type) {
  list.innerHTML = "";

  // SERIES
  if (type === "series") {
    data.series.forEach((s, i) => {
      let btn = document.createElement("button");
      btn.innerText = s.title;

      btn.onclick = () => showSeasons(i);

      list.appendChild(btn);
    });
  }

  // MOVIES
  if (type === "movies") {
    data.movies.forEach(m => {
      let btn = document.createElement("button");
      btn.innerText = m.title;

      btn.onclick = () => play(m.url);

      list.appendChild(btn);
    });
  }

  // LIVE TV (FIXED → pakai IPTV)
  if (type === "live") {
    showIPTV();
  }
}

/* =========================
   SERIES SYSTEM
========================= */
function showSeasons(seriesIndex) {
  list.innerHTML = "";

  let series = data.series[seriesIndex];

  series.seasons.forEach(season => {
    let title = document.createElement("h3");
    title.innerText = "Season " + season.season;
    list.appendChild(title);

    season.episodes.forEach(ep => {
      let btn = document.createElement("button");
      btn.innerText = ep.title;

      btn.onclick = () => play(ep.url);

      list.appendChild(btn);
    });
  });
}

/* =========================
   IPTV LIVE TV VIEW
========================= */
async function showIPTV() {
  list.innerHTML = "";

  let channels = await loadM3U("live.m3u");

  channels.forEach(ch => {
    let btn = document.createElement("button");
    btn.innerText = "📺 " + ch.title;

    btn.onclick = () => play(ch.url);

    list.appendChild(btn);
  });
}

/* =========================
   PLAYER
========================= */
function play(url) {
  player.src = url;
  player.play();
}
