class Composant{
    constructor(name, domElm, domTarget){
        this.name = name;
        poudlard[name] = this;
        this.DOM = document.createElement(domElm);
        domTarget.appendChild(this.DOM);
    }

    render(){}

    update(key, value){
        this[key] = value;
        this.render();
        console.log(this.name, key, value);
    }
}
