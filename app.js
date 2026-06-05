const player = document.getElementById("player");
const playlistDiv = document.getElementById("playlist");

let videos = [];

fetch("playlist.json")
  .then(res => res.json())
  .then(data => {
    videos = data;
    renderPlaylist();

    // auto play first video
    if (videos.length > 0) {
      playVideo(0);
    }
  });

function renderPlaylist() {
  playlistDiv.innerHTML = "";

  videos.forEach((video, index) => {
    const btn = document.createElement("button");
    btn.textContent = video.title;

    btn.onclick = () => playVideo(index);

    playlistDiv.appendChild(btn);
  });
}

function playVideo(index) {
  player.src = videos[index].url;
  player.play();
}
