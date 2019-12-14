export default function note(url) {
    // create a Voice Note.
    const audio = document.createElement("audio"),
        delBtn = document.createElement("button"),
        playBtn = document.createElement("button"),
        downloadBtn = document.createElement("button"),
        card = document.createElement("article");
    downloadBtn.classList.add("download");
    downloadBtn.textContent = "download";
    delBtn.textContent = "X";
    delBtn.classList.add("delete");
    playBtn.textContent = "play";
    playBtn.classList.add("play");
    card.classList.add("note");
    audio.src = url;
    audio.display = "none";
    // download voice note.
    downloadBtn.onclick = e => {
        let a = document.createElement("a");
        a.style = "display:none";
        a.href = url;
        a.download = "note.mp3";
        a.click();
    }
    delBtn.onclick = e => {
        notes.removeChild(card);
    }
    audio.onended = e => {
        playBtn.textContent = "play"
    }
    playBtn.onclick = e => {
            const play = () => {
                    audio.play()
                    playBtn.textContent = "playing"
                },
                pause = () => {
                    playBtn.textContent = "pause";
                    audio.pause();
                }
            audio.paused ? play() : pause()

        }
        [audio, delBtn, playBtn, downloadBtn].forEach(val => card.appendChild(val));

    return (card);

}