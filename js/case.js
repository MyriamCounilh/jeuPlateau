class Case extends Composant{
    constructor(name, domTarget){
        super(name, "case", domTarget);
        this.obstacle = false;
        this.idPlayer1 = false;
        this.idPlayer2 = false;
        //this.weapon = null;
    }

    render(){
        this.DOM.className = "";
        if (this.obstacle) this.DOM.className = "obstacle";
        if (this.idPlayer1) this.DOM.className = "player1";
        if (this.idPlayer2) this.DOM.className = "player2";
    }
}
