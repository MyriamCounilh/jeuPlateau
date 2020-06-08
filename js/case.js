class Case extends Composant{

    constructor(lettre, row, col, domTarget, clickEventMethod){
        super(lettre + col, "case", domTarget);
        this.obstacle = false;
        this.player = false;
        this.weapon = false;
        this.way = false;
        this.row = row;
        this.col = col;
        this.clickEventMethod = clickEventMethod;
        this.DOM.onclick = this.handleClick.bind(this);
    }

//Clique
    handleClick() {
        if (this.way) {
            this.clickEventMethod(this);
        }
    }

    render(){
        this.DOM.className = "";
        if (this.obstacle) this.DOM.className = "obstacle";
        if (this.weapon) this.DOM.className = this.weapon.className;
        if (this.player) this.DOM.className = this.player.className;
        if (this.way) this.DOM.className = this.DOM.className + " way";
    }

    isTaken() {
        console.log(this);
        if (this.obstacle) return true;
        if (this.player) return true;
        if (this.weapon) return true;
        return false;
    }

}
