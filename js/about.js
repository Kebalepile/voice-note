export default () => {
    const card = document.createElement("article"),
        header = document.createElement("h2"),
        hr = document.createElement("hr"),
        b = document.createElement("br"),
        p1 = document.createElement("p"),
        p2 = document.createElement("p"),
        p3 = document.createElement("p");
    card.classList.add("author");
    header.textContent = "About web-app";
    p1.textContent = "web-app created by: K.T Motshoana";
    p2.textContent = 'App discription a voice recorder, you can create voice notes, play them, download for future use or delete noce done';
    p3.textContent = "Version: 1.0.0";

    [header, hr, b, p1, p2, b, p3].forEach(val => {
        card.appendChild(val);
    });

    document.body.appendChild(card);

    card.onclick = e => {
        document.body.removeChild(card);
        document.querySelector("#about").disabled=false;
    }
}