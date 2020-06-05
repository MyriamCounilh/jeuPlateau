var poudlard = {};
var level = {
    "facile" : {
        colonnes  : 8,
        rangees   : 8,
        obstacles : 3,
    },
    "moyen" : {
        colonnes  : 10,
        rangees   : 10,
        obstacles : 5,
    },
    "dur" : {
        colonnes  : 12,
        rangees   : 12,
        obstacles : 5,
    }
}

//L’arme par défaut qui équipe les joueurs doit infliger 10 points de dégâts
/*Lors d'un combat, le fonctionnement du jeu est le suivant :
Chacun attaque à son tour
Les dégâts infligés dépendent de l’arme possédée par le joueur
Le joueur peut choisir d’attaquer ou de se défendre contre le prochain coup
Lorsque le joueur se défend, il encaisse 50% de dégâts en moins qu’en temps normal
Dès que les points de vie d’un joueur (initialement à 100) tombent à 0 , celui-ci a perdu.
Un message s’affiche et la partie est terminée.*/

var player1 = new Player('joueur1');
var player2 = new Player('joueur2');

var weaponDefault = new Weapon('baguette', 10, 'baguette')
var weaponCollier = new Weapon('collier', 15, 'collierOpale');
var weaponAcromantula = new Weapon('acromantula', 20, 'acromantula');
var weaponFaux = new Weapon('faux', 30, 'faux');
var weaponPotion = new Weapon('potion Flamme Violette', 10, 'potion');
var weapons = [weaponCollier, weaponAcromantula, weaponFaux, weaponPotion];

var difficulty;
var indexRangee = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

function generate() {
    console.clear();
    difficulty = findLevel();
    console.log(difficulty);
    firstName1 = player1;
    firstName2 = player2;
    console.log(player1, player2);
    if (level[difficulty] === undefined) {
        alert("Merci de sélectionner un level !");
        return;
    }

    const textPlateau = `<h3 class="text-center mb-3"> Bienvenue à Poudlard, 2 sorciers s'affrontent en duel chacun leur tour.
                         Attention, il ne peut en rester qu'un !</h3>`;

    document.getElementById("textePlateau").innerHTML = textPlateau;

    // Le plateau
    document.documentElement.style.setProperty('--qteColones', level[difficulty].colonnes);
    const cible = document.querySelector("plateau");
    clearPlateau(cible);

    let letter;
    for (let range = 0; range < level[difficulty].rangees; range++) {
        letter = indexRangee[range];
        for (let colonne = 0; colonne < level[difficulty].colonnes; colonne++) {
            new Case(letter + colonne, cible);
        }
    }

    //Case inaccessible
    let obstaclesToAdd = level[difficulty].obstacles;
    let position;
    while (obstaclesToAdd > 0) {
        position = randomCase();
        if (!poudlard[position].obstacle) {
            obstaclesToAdd--;
            poudlard[position].update("obstacle", true);
        }
    }

    //position des armes
    let weaponToAdd = weapons.length;
    let positionWeapon;
    while (weaponToAdd > 0) {
        positionWeapon = randomCaseNumber();
        if (!isTaken(positionWeapon.col, positionWeapon.row)){
            weaponToAdd--;
            poudlard[indexRangee[positionWeapon.row] + positionWeapon.col].update("weapon", weapons[weaponToAdd]);
        }
    }

    placePlayer1();
    placePlayer2();

}

//Place le joueur1
function placePlayer1(){
    let position = randomCaseNumber();
    let error = 0;
    if (isTaken(position.col, position.row)) error = 4;
    if (isTaken(position.col+1, position.row)) error++;
    if (isTaken(position.col-1, position.row)) error++;
    if (isTaken(position.col, position.row+1)) error++;
    if (isTaken(position.col, position.row-1)) error++;
    if (error >= 4) return placePlayer1();
    else poudlard[indexRangee[position.row] + position.col].update("player", player1);
}

//Place le joueur2
function placePlayer2(){
    let position = randomCaseNumber();
    let error = 0;
    if (isTaken(position.col, position.row)) error = 4;
    if (isTaken(position.col+1, position.row)) error++;
    if (isTaken(position.col-1, position.row)) error++;
    if (isTaken(position.col, position.row+1)) error++;
    if (isTaken(position.col, position.row-1)) error++;
    if (error >= 4) return placePlayer2();
    error = 0;
    if (isPlayerHere(position.col, position.row)) error++;
    if (isPlayerHere(position.col+1, position.row)) error++;
    if (isPlayerHere(position.col-1, position.row)) error++;
    if (isPlayerHere(position.col, position.row+1)) error++;
    if (isPlayerHere(position.col, position.row-1)) error++;
    if (error >= 1) return placePlayer2();
    else poudlard[indexRangee[position.row] + position.col].update("player", player2);
}

// @description vider la grille
function clearPlateau(plateau) {
    while (plateau.firstChild) {
        plateau.removeChild(plateau.firstChild);
    }
}

function randomCaseNumber() {
    return {
        "row": Math.floor(Math.random() * level[difficulty].rangees),
        "col": Math.floor(Math.random() * level[difficulty].colonnes),
    };
}

function isTaken(col, row) {
    if (row >= level[difficulty].rangees || row < 0 || col >= level[difficulty].colonnes || col < 0) {
        return true;
    }
    return poudlard[indexRangee[row] + col].isTaken();
}

function isPlayerHere(col, row){
    if (row >= level[difficulty].rangees || row < 0 || col >= level[difficulty].colonnes || col < 0) {
        return false;
    }
    if (poudlard[indexRangee[row] + col].player) return true;
    return false;
}


// @description
function randomCase() {
    return indexRangee[Math.floor(Math.random() * level[difficulty].rangees)] + Math.floor(Math.random() * level[difficulty].colonnes);
}

function findLevel() {
    if (document.getElementById("facile").checked) return "facile";
    if (document.getElementById("moyen").checked) return "moyen";
    if (document.getElementById("dur").checked) return "dur";
    return "";
}
