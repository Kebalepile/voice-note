import { deleteNote, getNote } from "../database/indexDB.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="./main.css"/>
  <section class="note">
    <div class="note-info">
    <img src="#" id="icon" alt="note icon"/>
    <strong id="title"></strong>
    </div>
    <div class="note-history">
       <strong class="date">2023/01/21</strong>
         <img src="../images/icons/trash.svg"  alt="delete button" class="delete" />
    </div>
  </section>`;

class Note extends HTMLElement {
  constructor(data) {
    super();
    const templateContent = template.content;
    this.displayed = false;

    this.attachShadow({ mode: "open" }).appendChild(
      templateContent.cloneNode(true)
    );
    this.data = data;
  }
  connectedCallback() {
    this.determineType();
  }
  dataDisplayed(state = null) {
    if (state !== null) {
      this.displayed = state;
      return;
    }
    return this.displayed;
  }

  determineType() {
    switch (this.data.type) {
      case "text":
        // add text svg
        this.data.iconPath = "../images/icons/txt.png";
        break;
      case "audio":
        // add mp3 svg
        this.data.iconPath = "../images/icons/mp3.png";
        break;
    }
    this.details();
  }
  details() {
    const title = this.shadowRoot.querySelector("#title");
    title.innerHTML = this.data.title;
    title.addEventListener("click", (e) => {
      this.content();
    });
    this.shadowRoot.querySelector("#icon").src = this.data.iconPath;
    this.shadowRoot.querySelector(".date").innerHTML = this.data.date;
    this.shadowRoot
      .querySelector(".delete")
      .addEventListener("click", (e) => this.delete());
  }

  async content() {
    try {
      let note = await getNote(this.data.title, this.data.type);

      switch (note.type) {
        case "audio":
          if (!this.dataDisplayed()) {
            let title = this.shadowRoot.querySelector("#title");
            let audio = document.createElement("audio");
            audio.autoplay = true;
            audio.volume = 1;

            let source = document.createElement("source");

            source.src = URL.createObjectURL(note.audioBlob);
            source.type = "audio/webm";

            audio.appendChild(source);

            audio.addEventListener("play", (e) => {
              title.innerHTML = "...Playing audio note";
              this.dataDisplayed(true);
            });
            audio.addEventListener("ended", (e) => {
              this.dataDisplayed(false);
              this.shadowRoot.removeChild(audio);
              title.innerHTML = this.data.title;
            });
            this.shadowRoot.appendChild(audio);
          }

          break;
        case "text":
          let textnote = document.createElement("article"),
            btn = document.createElement("button"),
            paragraph = document.createElement("p");
          const removeNote = () => {
            this.shadowRoot.removeChild(textnote);
            this.dataDisplayed(false);
          };
          if (!this.dataDisplayed()) {
            textnote.classList.add("textnote");
            btn.textContent = "close";
            btn.addEventListener("click", (e) => removeNote());
            paragraph.textContent = note.content;

            textnote.appendChild(btn);
            textnote.appendChild(paragraph);
            this.shadowRoot.appendChild(textnote);
            this.dataDisplayed(true);
            return;
          }
          removeNote();
          break;
        default:
          console.log("Hello Guy.");
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }
  delete() {
    const { title, type } = this.data;
    deleteNote(title, type);
    this.parentNode.removeChild(this);
  }
}

export default function (data, parent) {
  try {
    if (!customElements.get("note-component")) {
      customElements.define("note-component", Note);
    }
    parent.appendChild(new Note(data));
  } catch (err) {
    console.log("note component error: ", err);
  }
}
