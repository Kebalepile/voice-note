import toggle from "../utils/toggle.js";

let display = false;
const infoBtn = document.querySelector("#info"),
  template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="./main.css">
    <svg id="arrow-left" fill="#000000" viewBox="-2.4 -2.4 28.80 28.80" id="left-arrow" xmlns="http://www.w3.org/2000/svg" class="icon line"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M21,12H3M6,9,3,12l3,3" style="fill: none; stroke: #000000; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5;"></path></g></svg> 

      <section id="web-app-info">
      <p>Note-Taker web application you allows to type, record todo task or reminders , set date alert reminders on when to complete saved task.<br/><br/>
       Web app helps you to be more organised, all data is saved locally on your browser via indexdb,
        which can be accessed while your online or offline. </p>
        <h5>&copy; 2023 K.T Motshoana </h5>
      </section>
    `;
class InfoComponent extends HTMLElement {
  constructor() {
    super();
    const templateContent = template.content;
    this.attachShadow({ mode: "open" }).appendChild(
      templateContent.cloneNode(true)
    );
  }
  connectedCallback() {
    this.shadowRoot
      .querySelector("#arrow-left")
      .addEventListener("click", listener);
  }
}
// turn into toggle utill module in order to use all components which toggle.
const listener = (e) => {
  display = toggle(InfoComponent, "info-component", display);
};

try {

  infoBtn.addEventListener("click", listener);
} catch (err) {
  console.log(`Broswer error: ${err}`);
}
