import toggle from "../utils/toggle.js";

import { addNote } from "../database/indexDB.js";
let display = false;

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="./main.css">
    <section class="note-form">
        <input type="text" name="Title" placeholder="Enter Title" minlength="1" maxlength="20"/>
        <p> <strong>Date</strong>: ${new Date().toDateString()}</p>
       <textarea  name="Textarea" maxlength="100" placeholder="Maximum words allowed is 100"></textarea>
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
class TextformComponent extends HTMLElement {
  constructor() {
    super();
    const templateContent = template.content;

    this.attachShadow({ mode: "open" }).appendChild(
      templateContent.cloneNode(true)
    );
  }
  connectedCallback() {
    this.shadowRoot
      .querySelector(".cancel")
      .addEventListener("click", listener);
    this.shadowRoot.querySelector(".save").addEventListener("click", (e) => {
      this.data();
    });
    this.shadowRoot
      .querySelector("textarea")
      .addEventListener("click", this.text);
  }
  data() {
    const elements = [
      "input[type='text']",
      "textarea",
      "input[type='date']",
    ].map((element) => this.shadowRoot.querySelector(element));
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
        content: elements[1].value,
        deadline: elements[2].value,
        date: new Date().toDateString(),
        type: "text",
        notified: false,
      };

      // Pulp Fiction is better, Django is funny.
      addNote(data);
      this.save();
    }
  }

  save() {
    display = toggle(TextformComponent, "textform-component", display);
  }
}
const listener = (e) => {
  display = toggle(TextformComponent, "textform-component", display);
};

try {
  document
    .querySelector("#textnote-icon")
    .addEventListener("click", listener);
} catch (err) {
  console.log(`TextnoteForm component error: ${err}`);
}
