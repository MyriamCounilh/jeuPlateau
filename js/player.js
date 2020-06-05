class Player {

    constructor(className) {
        this.life = 100;
        this.className = className;
    }

    status() {
        return `${this.className} a ${this.life} points de vie`;
    }
}
