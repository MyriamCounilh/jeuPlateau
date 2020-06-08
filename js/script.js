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

var weaponDefault = new Weapon('Arme par défaut', 10, 'baguette', 'baguette.png');
var weaponCollier = new Weapon('Collier ensorcellé', 15, 'collierOpale', 'collierOpale.png');
var weaponAcromantula = new Weapon('Grande Tarentule', 20, 'acromantula', 'acromantula.jpg');
var weaponFaux = new Weapon('Faux qui invoque un épouvantard', 30, 'faux', 'faux.png');
var weaponPotion = new Weapon('potion Flamme Violette', 10, 'potion', 'potion.png');
poudlard['weapons'] = [weaponCollier, weaponAcromantula, weaponFaux, weaponPotion];
poudlard['inTurn'] = null;

var difficulty;
var indexRangee = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var firstNameInput1;
var firstNameInput2;

function generate() {
    console.clear();
    difficulty = findLevel();

    if (level[difficulty] === undefined) {
        alert("Merci de sélectionner une difficulté !");
        return;
    }

    poudlard['player1'] = new Player('joueur1', weaponDefault);
    poudlard['player2'] = new Player('joueur2', weaponDefault);

    setPlayersName();

    $('.box').each(function() {
        $(this).removeClass('d-none');
    });

    initProgressBar($("#progressBarPlayer1"));
    initProgressBar($("#progressBarPlayer2"));

    const textPlateau = `<h3 class="text-center mb-3"> Bienvenue à Poudlard, 2 sorciers s'affrontent en duel chacun leur tour.
                         Attention, il ne peut en rester qu'un !</h3>`;

    document.getElementById("textePlateau").innerHTML = textPlateau;

    // Le plateau
    document.documentElement.style.setProperty('--qteColones', level[difficulty].colonnes);
    const cible = document.querySelector("plateau");
    clearPlateau(cible);

    // Création des cases
    let letter;
    for (let range = 0; range < level[difficulty].rangees; range++) {
        letter = indexRangee[range];
        for (let colonne = 0; colonne < level[difficulty].colonnes; colonne++) {
            new Case(letter, range, colonne, cible, clickInWayCase);
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

    //Position des armes
    let weaponToAdd = poudlard['weapons'].length;
    let positionWeapon;
    while (weaponToAdd > 0) {
        positionWeapon = randomCaseNumber();
        if (!isTaken(positionWeapon.col, positionWeapon.row)){
            weaponToAdd--;
            poudlard[indexRangee[positionWeapon.row] + positionWeapon.col].update("weapon", poudlard['weapons'][weaponToAdd]);
        }
    }

    placePlayer1();
    placePlayer2();

    if (Math.random() > 0.5) {
        poudlard['inTurn'] = poudlard['player1'];
        showModal(`${firstNameInput1} commence la partie`)
    } else {
        poudlard['inTurn'] = poudlard['player2'];
        showModal(`${firstNameInput2} commence la partie`)
    }
    showInTurn(true);
}

function initProgressBar(progressBar) {
    progressBar.removeClass('bg-info');
    progressBar.removeClass('bg-warning');
    progressBar.removeClass('bg-danger');
    progressBar.addClass('bg-success');
    progressBar.css("width" , 100 + "%");
    progressBar.text(100);
}

function setPlayersName() {
    firstNameInput1 = $('#firstNameInput1').val();
    firstNameInput2 = $('#firstNameInput2').val();
    if (firstNameInput1 === '') {
        firstNameInput1 = 'Harry';
    }
    $('#firstName1').text(firstNameInput1);
    poudlard['player1'].name = firstNameInput1;

    if (firstNameInput2 === '') {
        firstNameInput2 = 'Ron';
    }
    $('#firstName2').text(firstNameInput2);
    poudlard['player2'].name = firstNameInput2;
}

function clickInWayCase(c) {
    clickInWayCaseForPlayer(c, poudlard['inTurn']);

    if (!isPlayerNext(poudlard['inTurn'])) {
        showInTurn(true);
    } else {
        showInTurn(false);
    }
}

function fight(playerName) {
    const player = poudlard[playerName];
    let playerDommage;
    let progressBar
    let damage = player.weapon.degat;
    if (player === poudlard['player1']) {
        playerDommage = poudlard['player2'];
        progressBar = $("#progressBarPlayer2");
    } else {
        playerDommage = poudlard['player1'];
        progressBar = $("#progressBarPlayer1");
    }

    if (playerDommage.shield) {
        damage = damage / 2;
    }
    playerDommage.life -= damage;
    if (playerDommage.life < 0) {
        playerDommage.life = 0;
    }
    progressBar.css("width" , playerDommage.life + "%");
    progressBar.text(playerDommage.life);
    if (playerDommage.life <= 75) {
        progressBar.removeClass('bg-success');
        progressBar.addClass('bg-info');
    }

    if (playerDommage.life <= 50) {
        progressBar.removeClass('bg-info');
    }

    if (playerDommage.life <= 25) {
        progressBar.addClass('bg-warning');
    }

    if (playerDommage.life <= 10) {
        progressBar.removeClass('bg-warning');
        progressBar.addClass('bg-danger');
    }

    if (playerDommage.life === 0) {
        $(".actionPlayer1").prop('disabled', true);
        $(".actionPlayer2").prop('disabled', true);
        showModal(`${player.name} a gagné la partie !`);
        return;
    }
    switchPlayer(false);
}

function defend(playerName) {
    const player = poudlard[playerName];
    player.shield = true;
    if (player === poudlard['player1']) {
        $("#shieldPlayer1").removeClass('d-none');
    } else {
        $("#shieldPlayer2").removeClass('d-none');
    }
    //console.log(player);
    switchPlayer(false);
}

function switchPlayer(canMove) {
    if (poudlard['inTurn'] === poudlard['player1']) {
        poudlard['inTurn'] = poudlard['player2'];
    } else {
        poudlard['inTurn'] = poudlard['player1'];
    }
    showInTurn(canMove);
}

function isPlayerNext(player) {
    if (isPlayerHere(player.position.col+1, player.position.row)) return true;
    if (isPlayerHere(player.position.col-1, player.position.row)) return true;
    if (isPlayerHere(player.position.col, player.position.row+1)) return true;
    if (isPlayerHere(player.position.col, player.position.row-1)) return true;
    return false;
}

/**
 * @description
 */
function clickInWayCaseForPlayer(c, player) {
    drawWay(player, false);
    if (c.row < player.position.row ) {
        findWeaponInWayInTop(c, player);
    } else if (c.row > player.position.row ) {
        findWeaponInWayInBottom(c, player);
    } else if (c.col < player.position.col ) {
        findWeaponInWayInLeft(c, player);
    } else if (c.col > player.position.col ) {
        findWeaponInWayInRight(c, player);
    }
    poudlard[indexRangee[player.position.row] + player.position.col].update("player", false);
    poudlard[indexRangee[c.row] + c.col].update("player", player);
    player.position = c;
    switchPlayer(!isPlayerNext(poudlard['inTurn']));
}

function findWeaponInWayInTop(c, player) {
    if (isWeapon(player.position.col , player.position.row - 1)) {
        switchWeapon(player, player.position.col, player.position.row - 1);
    }
    if (isWeapon(player.position.col , player.position.row - 2) && (c.row <= player.position.row - 2)) {
        switchWeapon(player, player.position.col, player.position.row - 2);
    }
    if (isWeapon(player.position.col , player.position.row - 3) && (c.row <= player.position.row - 3)) {
        switchWeapon(player, player.position.col, player.position.row - 3);
    }
}

function findWeaponInWayInBottom(c, player) {
    if (isWeapon(player.position.col , player.position.row + 1)) {
        switchWeapon(player, player.position.col, player.position.row + 1);
    }
    if (isWeapon(player.position.col , player.position.row + 2) && (c.row >= player.position.row + 2)) {
        switchWeapon(player, player.position.col, player.position.row + 2);
    }
    if (isWeapon(player.position.col , player.position.row + 3) && (c.row >= player.position.row + 3)) {
        switchWeapon(player, player.position.col, player.position.row + 3);
    }
}

function findWeaponInWayInLeft(c, player) {
    if (isWeapon(player.position.col - 1 , player.position.row)) {
        switchWeapon(player, player.position.col - 1, player.position.row);
    }
    if (isWeapon(player.position.col - 2 , player.position.row) && (c.col <= player.position.col - 2)) {
        switchWeapon(player, player.position.col - 2, player.position.row);
    }
    if (isWeapon(player.position.col - 3 , player.position.row) && (c.col <= player.position.col - 3)) {
        switchWeapon(player, player.position.col - 3, player.position.row);
    }
}

function findWeaponInWayInRight(c, player) {
    if (isWeapon(player.position.col + 1 , player.position.row)) {
        switchWeapon(player, player.position.col + 1, player.position.row);
    }
    if (isWeapon(player.position.col + 2 , player.position.row) && (c.col >= player.position.col + 2)) {
        switchWeapon(player, player.position.col + 2, player.position.row);
    }
    if (isWeapon(player.position.col + 3 , player.position.row) && (c.col >= player.position.col + 3)) {
        switchWeapon(player, player.position.col + 3, player.position.row);
    }
}

function switchWeapon(player, col, row) {
    let weaponTemporary;
    weaponTemporary = player.weapon;
    player.weapon = poudlard[indexRangee[row] + col].weapon;
    poudlard[indexRangee[row] + col].update("weapon", weaponTemporary);
    let weaponPlayerHTML;
    if (player === poudlard['player1']) {
        weaponPlayerHTML = $('.weaponPlayer1');
    } else {
        weaponPlayerHTML = $('.weaponPlayer2');
    }
    weaponPlayerHTML.html(`<div><img class="imgWeaponBox mt-3" src="img/arme/${player.weapon.imageName}"></div>
                           <div><h6>${player.weapon.label}</h6></div>
                           <div><h6>Dégâts : ${player.weapon.degat} points</h6></div>`);
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
    else {
        poudlard['player1'].position = position;
        poudlard[indexRangee[position.row] + position.col].update("player", poudlard['player1']);
    }
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
    else {
        poudlard['player2'].position = position;
        poudlard[indexRangee[position.row] + position.col].update("player", poudlard['player2']);
    }
}

/**
 * @description vider la grille
 */
function clearPlateau(plateau) {
    while (plateau.firstChild) {
        plateau.removeChild(plateau.firstChild);
    }
}


/**
 * @description
 */
function randomCaseNumber() {
    return {
        "row": Math.floor(Math.random() * level[difficulty].rangees),
        "col": Math.floor(Math.random() * level[difficulty].colonnes),
    };
}

function isObstacleOrPlayer(col, row) {
    if (row >= level[difficulty].rangees || row < 0 || col >= level[difficulty].colonnes || col < 0) {
        return true;
    }
    if (poudlard[indexRangee[row] + col].obstacle) return true;
    return (poudlard[indexRangee[row] + col].player);
}

/**
 * @description
 */
function isTaken(col, row) {
    if (row >= level[difficulty].rangees || row < 0 || col >= level[difficulty].colonnes || col < 0) {
        return true;
    }
    return poudlard[indexRangee[row] + col].isTaken();
}

function isWeapon(col, row) {
    if (row >= level[difficulty].rangees || row < 0 || col >= level[difficulty].colonnes || col < 0) {
        return false;
    }
    return poudlard[indexRangee[row] + col].weapon;
}

function isPlayerHere(col, row){
    if (row >= level[difficulty].rangees || row < 0 || col >= level[difficulty].colonnes || col < 0) {
        return false;
    }
    return (poudlard[indexRangee[row] + col].player);
}

/**
 * @description
 */
function randomCase() {
    return indexRangee[Math.floor(Math.random() * level[difficulty].rangees)] + Math.floor(Math.random() * level[difficulty].colonnes);
}

function findLevel() {
    if (document.getElementById("facile").checked) return "facile";
    if (document.getElementById("moyen").checked) return "moyen";
    if (document.getElementById("dur").checked) return "dur";
    return "";
}

/**
 * @description
 */
function showInTurn(canMove) {
    if (poudlard['inTurn'] === poudlard['player1']) {
        $("#boxPlayer1").addClass("inTurn");
        $("#boxPlayer2").removeClass("inTurn");
        if (canMove) {
            drawWay(poudlard['player1'], true);
        } else {
            $(".actionPlayer1").prop('disabled', false);
            $(".actionPlayer2").prop('disabled', true);
            poudlard['player1'].shield = false;
            $("#shieldPlayer1").addClass('d-none');
        }
    } else {
        $("#boxPlayer1").removeClass("inTurn");
        $("#boxPlayer2").addClass("inTurn");
        if (canMove) {
            drawWay(poudlard['player2'], true);
        } else {
            $(".actionPlayer1").prop('disabled', true);
            $(".actionPlayer2").prop('disabled', false);
            poudlard['player2'].shield = false;
            $("#shieldPlayer2").addClass('d-none');
        }
    }
}

/**
 * @description dessiner la route pour le joueur sélectionné
 */
function drawWay(player, show) {
    doDrawWayToTop(player.position, show);
    doDrawWayToBottom(player.position, show);
    doDrawWayToRight(player.position, show);
    doDrawWayToLeft(player.position, show);
}

function doDrawWayToTop(position, show) {
    if (!isObstacleOrPlayer(position.col, position.row - 1)) {
        poudlard[indexRangee[position.row - 1] + position.col].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col, position.row - 2)) {
        poudlard[indexRangee[position.row - 2] + position.col].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col, position.row - 3)) {
        poudlard[indexRangee[position.row - 3] + position.col].update("way", show);
    }
}

function doDrawWayToBottom(position, show) {
    if (!isObstacleOrPlayer(position.col, position.row + 1)) {
        poudlard[indexRangee[position.row + 1] + position.col].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col, position.row + 2)) {
        poudlard[indexRangee[position.row + 2] + position.col].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col, position.row + 3)) {
        poudlard[indexRangee[position.row + 3] + position.col].update("way", show);
    }
}

function doDrawWayToLeft(position, show) {
    if (!isObstacleOrPlayer(position.col - 1, position.row )) {
        poudlard[indexRangee[position.row] + (position.col - 1)].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col - 2, position.row)) {
        poudlard[indexRangee[position.row] + (position.col - 2)].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col - 3, position.row)) {
        poudlard[indexRangee[position.row] + (position.col - 3)].update("way", show);
    }
}

function doDrawWayToRight(position, show) {
    if (!isObstacleOrPlayer(position.col + 1, position.row)) {
        poudlard[indexRangee[position.row] + (position.col + 1)].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col + 2, position.row)) {
        poudlard[indexRangee[position.row] + (position.col + 2)].update("way", show);
    } else return;

    if (!isObstacleOrPlayer(position.col + 3, position.row)) {
        poudlard[indexRangee[position.row] + (position.col + 3)].update("way", show);
    }
}

function showModal(body) {
    $('#modalBody').text(body);
    $('#modal').modal({
        show: true
    });
}
