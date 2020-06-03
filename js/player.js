class Player extends Composant{

    constructor(name, domTarget) {
        super(name, "case", domTarget);
        this.life = 100;
        //nom du joueur
        //combat
        //déplacement
    }

    render() {
        this.DOM.className = "life";
        //if (this.life) this.DOM.className = "life";
    }
}
