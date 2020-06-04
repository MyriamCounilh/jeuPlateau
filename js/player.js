class Player {

    constructor(className) {
        this.life = 100;
        this.className = className;
    }

    status() {
        return `${this.className} a ${this.life} points de vie`;
    }

    // Attaque une cible
    /*attaquer(player) {
        if (this.life > 0) {
            const degats = this.force;
            console.log(
                `${this.className} attaque ${
                    player.className
                } et lui inflige ${degats} points de dégâts`
            );
            player.life -= degats;
            if (player.life > 0) {
                console.log(`${cible.nom} a encore ${cible.sante} points de vie`);
            } else {
                player.life = 0;
                console.log(
                    `${this.className} a tué ${
                        player.className
                    } et perd ${bonusXP} points d'expérience`
                );
                this.xp -= bonusXP;
            }
        } else {
            console.log(
                `${this.className} n'a plus de points de vie et ne pas pas attaquer`
            );
        }
    }*/

}
