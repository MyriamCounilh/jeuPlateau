class Case extends Composant{

    constructor(name, domTarget){
        super(name, "case", domTarget);
        this.DOM.innerHTML=name;
        this.obstacle = false;
        this.idPlayer1 = false;
        this.idPlayer2 = false;
        this.weapon = null;
        /*this.weapon1 = false;
        this.weapon2 = false;
        this.weapon3 = false;
        this.weapon4 = false;*/

    }

    render(){
        this.DOM.className = "";
        if (this.obstacle) this.DOM.className = "obstacle";
        if (this.idPlayer1) this.DOM.className = "player1";
        if (this.idPlayer2) this.DOM.className = "player2";
        if (this.weapon) this.DOM.className = this.weapon.className;
    }

    //isTaken = boolean;
    isTaken() {
        return this.obstacle || this.idPlayer1 || this.idPlayer2 || this.weapon;
    }

}
