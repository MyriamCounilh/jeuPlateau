class Case extends Composant{
    constructor(name, domTarget){
        super(name, "case", domTarget);
        this.obstacle = false;
        this.DOM.innerHTML=name;
    }

    render(){
        this.DOM.className = "";
        if (this.obstacle) this.DOM.className = "obstacle";
    }

}
