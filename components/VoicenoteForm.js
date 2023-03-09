import toggle from "../utils/toggle.js";
import { addNote } from "../database/indexDB.js";
let display = false;

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="./main.css">
    <section class="note-form">
        <input type="text" name="Title" placeholder="Enter Title..." minlength="1" maxlength="20"/>
        <p> <strong>Date</strong>: ${new Date().toDateString()}</p>
        <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#1882af"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#2089b6;stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><polyline class="cls-1" points="23.45 11.04 21.55 11.04 18.68 17.73 17.73 17.73 17.73 6.27 16.77 6.27 12.96 22.5 12 22.5 12 1.5 11.04 1.5 7.23 17.73 6.27 17.73 6.27 6.27 6.27 6.27 5.32 6.27 2.46 11.04 0.55 11.04"></polyline></g></svg>
        <button  class="record">rec</button>
        <section class="deadline">
            <strong>Deadline:</strong>
            <input type="date" name="Deadline date" min="${new Date().getFullYear()}-01-01"/>
        </section>
        <section class="submit">
            <button class="cancel">cancel</button>
            <input class="save" type="submit" value="save"/>
        </section>
    </section>
    `;

class VoicenoteformComponent extends HTMLElement {
  constructor() {
    super();

    this._state = {
      record: false,
      audioBlob: null,
      mediaRecorder: (async function () {
        if (navigator.mediaDevices) {
          let constraints = { audio: true },
            stream = await navigator.mediaDevices.getUserMedia(constraints),
            mediaRecorder = new MediaRecorder(stream, {
              mimeType: "audio/webm;codecs=opus",
            });
          return mediaRecorder;
        } else {
          alert("Trouble obtaining media devices.");
        }
      })(),
    };
    const templateContent = template.content;
    this.attachShadow({ mode: "open" }).appendChild(
      templateContent.cloneNode(true)
    );
  }
  connectedCallback() {
    this.shadowRoot
      .querySelector(".cancel")
      .addEventListener("click", listener);
    this.shadowRoot
      .querySelector(".save")
      .addEventListener("click", (e) => this.save());
    this.shadowRoot.querySelector(".record").addEventListener("click", (e) => {
      this.record(e.target);
    });
  }
  setState(newState) {
    this._state = { ...this._state, ...newState };
  }
  getState() {
    return this._state;
  }

  async record(button) {

    let state = this.getState(),
      chunks = [],
      recorder = await state.mediaRecorder;

    if (state.record) {
      if (recorder.state === "recording" || recorder.state === "paused") {
        recorder.stop();

        this.setState({ record: false });
      }
    } else {
      recorder.start();
      // change HTML & CSS to indecate the Recording has began
      button.classList.add("alert");
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
          
        this.setState({ audioBlob:blob});
        // change HTML & CSS to indecate that recording has stopped.
        button.classList.toggle("alert")
      };
      this.setState({ record: true });
    }
  }

  data(audioBlob = null) {
    if (audioBlob) {
      const elements = ["input[type='text']", "input[type='date']"].map(
        (element) => this.shadowRoot.querySelector(element)
      );
      if (
        elements.every((elem) =>
          elem.value
            ? true
            : alert(
                `⛔ \n ${elem.name}: has no input, please add required Information.`
              )
        )
      ) {
        const data = {
          title: elements[0].value,
          deadline: elements[1].value,
          audioBlob,
          date: new Date().toDateString(),
          type: "audio",
          notified: false,
        };
        addNote(data);
        return true;
      }
    }
  }
  save() {
    const { audioBlob } = this.getState();
    if (audioBlob) {
      const done = this.data(audioBlob);
      if (done) {
        display = toggle(
          VoicenoteformComponent,
          "voicenoteform-component",
          display
        );
        return;
      }
    } else {
      alert("⛔ No audio to save, record or press cancel.");
    }
  }
}
const listener = (e) => {
  display = toggle(VoicenoteformComponent, "voicenoteform-component", display);
};
try {
  document
    .querySelector("#voicerecord-icon")
    .addEventListener("click", listener);
} catch (err) {
  console.log(`VoicenoteForm component error: ${err}`);
}
