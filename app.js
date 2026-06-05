const player = document.getElementById("player");
const menu = document.getElementById("menu");
const list = document.getElementById("list");

let data;

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    showMenu("series");
  });
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
}async function showIPTV() {
  list.innerHTML = "";

  let channels = await loadM3U("live.m3u");

  channels.forEach(ch => {
    let btn = document.createElement("button");
    btn.innerText = ch.title;

    btn.onclick = () => {
      player.src = ch.url;
      player.play();
    };

    list.appendChild(btn);
  });
}
function showMenu(type) {
  list.innerHTML = "";

  if (type === "series") {
    data.series.forEach((s, i) => {
      let btn = document.createElement("button");
      btn.innerText = s.title;

      btn.onclick = () => showSeasons(i);

      list.appendChild(btn);
    });
  }

  if (type === "movies") {
    data.movies.forEach((m) => {
      let btn = document.createElement("button");
      btn.innerText = m.title;

      btn.onclick = () => play(m.url);

      list.appendChild(btn);
    });
  }

  if (type === "live") {
    data.live.forEach((tv) => {
      let btn = document.createElement("button");
      btn.innerText = "LIVE: " + tv.title;

      btn.onclick = () => play(tv.url);

      list.appendChild(btn);
    });
  }
}

function showSeasons(seriesIndex) {
  list.innerHTML = "";

  let series = data.series[seriesIndex];

  series.seasons.forEach((season, si) => {
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

function play(url) {
  player.src = url;
  player.play();
}
