import toggle from "../utils/toggle.js";
import noteCard from "./note.js";
import { getAllNotes } from "../database/indexDB.js";

let display = false,
  notesAvailable;
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="./main.css" />
  <button class="close">X</button>
  <section id="notes">
  </section>`;

class NoteList extends HTMLElement {
  constructor() {
    super();
    const templateContent = template.content;
    this.attachShadow({ mode: "open" }).appendChild(
      templateContent.cloneNode(true)
    );
  }
  connectedCallback() {
    this.availableNotes();
    this.shadowRoot.querySelector(".close").addEventListener('click', e => {
      this.parentNode.removeChild(this);
      display = false;
    })
  }
  availableNotes() {
    const notesElement = this.shadowRoot.querySelector("#notes");
    for (let noteData of notesAvailable) noteCard(noteData, notesElement);
  }
}

document
  .querySelector("#notelist-icon")
  .addEventListener("click", async (e) => {
    try {
      notesAvailable = await getAllNotes();
      if (notesAvailable.length > 0) {
        display = toggle(NoteList, "notelist-component", display);
        
       
      }
     
    } catch (error) {
      console.error(error);
    }
  });

 
