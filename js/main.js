import note from "./note.js";
import rec from "./media.js";
import about from "./about.js";

const recorder = document.querySelector("#recorder"),
    startRec = document.querySelector(".voice-record"),
    aboutBtn = document.querySelector("#about");

aboutBtn.onclick = e => {
    about();
}
const display = (recURL) => {
    notes.appendChild(note(recURL, notes));
}
rec(recorder, startRec, display);