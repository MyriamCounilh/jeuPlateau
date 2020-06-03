class Weapon extends Composant{

    constructor(name, domTarget, className) {
        super(name, "case", domTarget);
        this.label = "baguette";
        this.degat = 10;
        this.className = className;

    }

    render() {
        this.DOM.className = this.className;
        //if (this.label) this.DOM.className = "label";
        //if (this.degat) this.DOM.className = "degat";
    }
}
