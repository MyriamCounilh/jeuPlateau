class Case extends Composant{

    constructor(name, domTarget){
        super(name, "case", domTarget);
        //this.DOM.innerHTML=name;
        this.obstacle = false;
        this.player = false;
        this.weapon = false;
    }

    render(){
        this.DOM.className = "";
        if (this.obstacle) this.DOM.className = "obstacle";
        if (this.weapon) this.DOM.className = this.weapon.className;
        if (this.player) this.DOM.className = this.player.className;
    }

    isTaken() {
        console.log(this)
        if (this.obstacle) return true;
        if (this.player) return true;
        if (this.weapon) return true;
        return false;
    }

}
