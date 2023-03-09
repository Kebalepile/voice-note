export default function toggleComponent(webComponent, componentName, condition, parent = document.body){
    switch(condition){
        case true:
            parent.removeChild(document.querySelector(componentName));
            condition = false;
            break;
        case false:
            if (!customElements.get(componentName)) {
                customElements.define(componentName, webComponent);
                parent.appendChild(new webComponent());
              }else{
                parent.appendChild(new webComponent());
              }
              condition = true;
             break;
    }

    return condition;
};