class Case extends Composant{

    constructor(name, domTarget){
        super(name, "case", domTarget);
        this.obstacle = false;
        this.idPlayer1 = false;
        this.idPlayer2 = false;
        this.weapon1 = false;
        this.weapon2 = false;
        this.weapon3 = false;
        this.weapon4 = false;

        //this.idPlayer = [];
    }

    render(){
        this.DOM.className = "";
        if (this.obstacle) this.DOM.className = "obstacle";
        if (this.idPlayer1) this.DOM.className = "player1";
        if (this.idPlayer2) this.DOM.className = "player2";
        if (this.weapon1) this.DOM.className = "arme1";
        if (this.weapon2) this.DOM.className = "arme2";
        if (this.weapon3) this.DOM.className = "arme3";
        if (this.weapon4) this.DOM.className = "arme4";
    }

    //isTaken = boolean;
    isTaken() {
        return this.obstacle || this.idPlayer1 || this.idPlayer2 || this.weapon1 || this.weapon2 || this.weapon3 || this.weapon4;
    }

}
