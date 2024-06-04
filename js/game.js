const env = "prod"
const connectedUser = JSON.parse(localStorage.getItem("connectedUser"))
const body = document.body
const gameModal = document.getElementById("game_modal")
const resultModal = document.getElementById("result_modal")
const gamePages = document.getElementById("game_pages")
const buttonLogout = document.getElementById("logout")
const buttonPause = document.getElementById("button_pause")
const buttonGuess = document.getElementById("button_guess")
const buttonRestart = document.getElementById("button_restart")
const spanNbTry = document.getElementById("nb_try")
const spanScore = document.getElementById("score")
const ranking = document.getElementById("ranking")
const rankingPlayers = document.getElementById("ranking_players")
const words = ["boire", "langage", "table", "ranger", "ecran", "dessiner", "rouler", "classe", "commutateur", "filiale", "editeur", "application", "rouge", "tenis", "ligue", "jeu", "jour", "nuit", "chambre", "hotel", "lycee", "college", "ecole", "primaire", "sac", "savon", "moto", "ivre", "blague", "blaguer", "nature", "naturel", "voyager", "jeune", "dame", "montagne", "camion", "espion", "guerre", "guerrier", "fumer", "journee", "abeille", "lion", "soigner", "fenetre", "rideau", "chaussure", "bidon", "armoire", "parfum", "mirroir", "disque", "maillot", "site", "internet", "preparer", "danser", "rire", "brancher", "pratiquer", "exercice", "contrat", "assurance", "banque", "voiture",  "ventilateur", "arroser",  "marcher", "avion", "telephone", "specialite", "abandonner", "vendre", "partir", "constitution", "ecouter", "entrepreneur", "digital", "digitalisation", "sommaire", "departement", "campus", "universite", "cinema", "chemise", "pantalon", "orange", "banane", "mangue", "avocat", "justice", "serveur", "homme", "fichier", "dossier", "apprendre", "programmation", "rassemblement", "ensemble", "pouvoir", "programme", "folie", "confinement", "maladie", "phase", "compilation", "football", "navigation", "navigateur", "philosophie", "histoire", "ordinateur", "film", "montre", "valeur", "hopital", "joueur", "routeur", "chaise", "climatiseur", "tableau", "ecran"]
let wordToBeGuess, guessedWord, index, score = 0, nbAttempts = 0, nbError = 0, step = 1, nbWordsFound = 0, nbWords = 0
let rankingUserScore
let generatedIndex = []

document.addEventListener("DOMContentLoaded", () => {
    // Affichage du nom de la personne connecté sur le header
    document.getElementById("username").innerText = connectedUser.username.toUpperCase()
    document.getElementById("player_profile").srcset = connectedUser.profileUrl
    loadUsers()
    displayGameModal()
    buttonGuess.addEventListener("click", validate)
    document.getElementById("guessed_word").addEventListener("keydown", event => {
        if (event.key === "Enter" || event.keyCode === 13) {
            buttonGuess.click()
        }
    })

    document.getElementById("btn_close_modal").addEventListener("click", () => {
        document.getElementById("modal_rules").classList.remove("modal-open")
        document.getElementById("ranking").classList.remove("hidden")
        document.getElementById("game_right_block").classList.remove("hidden")
        playAnimation()
    })

    document.getElementById("button_ranking").addEventListener("click", () => {
        document.getElementById("game_right_block").classList.remove("z-40")
        document.getElementById("game_right_block").classList.add("-z-40")
        ranking.classList.toggle("max-[600px]:hidden")
        TweenMax.from(ranking, .5, {
            delay: 0,
            x: -100,
            opacity: 0,
            ease: Expo.easeInOut
        })
    })

    document.getElementById("button_hide_ranking").addEventListener("click", () => {
        document.getElementById("game_right_block").classList.remove("-z-40")
        document.getElementById("game_right_block").classList.add("z-40")
        ranking.classList.toggle("max-[600px]:hidden")
    })

    document.getElementById("button_rules").addEventListener("click", () => {
        document.getElementById("modal_rules").classList.add("modal-open")
    })
})

buttonRestart.addEventListener("click", displayGameModal)

function displayGameModal() {
    if (gamePages.classList.contains("hidden")) {
        gamePages.classList.toggle("hidden")
        resultModal.classList.toggle("hidden")
        rankingPlayers.innerHTML = ""
        loadUsers()
    }

    spanScore.innerText = "Score: ".concat(score).concat(" XP")
    spanNbTry.innerText = "Tentative: ".concat(nbError).concat("/5")

    nextWord()
}

// Fonction pour rechercher l'indice généré dans le tableau des anciens indices
function findGeneratedValue(value) {
    for (let i = 0; i < generatedIndex.length; i++) {
        if (generatedIndex[i] === value) {
            return true
        }
    }

    return false
}

// Fonction pour cacher les lettres
function hideLetters(word) {
    return word.replace(/[aeiouy]/g, "*");
}

function nextWord() {
    do {
        index = Math.floor(Math.random() * words.length -1)
    } while (findGeneratedValue(index) || index > words.length || index < 0)

    generatedIndex.push(index)
    wordToBeGuess = words[index]
    document.getElementById("word_to_be_guessed").innerText = hideLetters(wordToBeGuess)
}

function validate() {
    guessedWord = document.getElementById("guessed_word").value.trim()

    if (guessedWord == "") {
        return
    }

    document.getElementById("guessed_word").value = ""

    if (wordToBeGuess == guessedWord) {
        showToast("success", 2000, "Felicitations")
        score += step
        nbError = 0
        nbAttempts++
        nbWordsFound++
        refreshUsersRanking()

        if (nbAttempts == 5) {
            step += score == 5 ? 10-step : 10
            nbAttempts = 0
        }
    } else {
        showToast("error", 3000, `Erreur, le mot était <span class="font-bold text-xl text-blue-700">'${wordToBeGuess}'</span>`)
        nbAttempts = 0
        nbError++

        if (nbError == 3) {
            score -= Math.floor(score / 5)
            score = score < 0 ? 0 : score
            refreshUsersRanking()
        }

        if (nbError == 5) {
            // Fin du jeu
            endGame()
            return
        }
    }

    nbWords++
    spanScore.innerText = "Score: ".concat(score).concat(" XP")
    spanNbTry.innerText = "Tentative: ".concat(nbError).concat("/5")
    nextWord()
    document.getElementById("guessed_word").focus()
}

function updateUserScore() {
    rankingUserScore.innerText = Number(rankingUserScore.innerText.substring(0, rankingUserScore.innerText.indexOf(' '))) + step + " XP"
}

function showToast(toastType, duration, text) {
    if (toastType === "success") {
        document.getElementById("toast_success").classList.toggle("hidden")
        document.getElementById("toast_success_text").innerHTML = text

        setTimeout(() => {
            document.getElementById("toast_success").classList.toggle("hidden")
        }, duration)
    }

    if (toastType === "error") {
        document.getElementById("toast_error").classList.toggle("hidden")
        document.getElementById("toast_error_text").innerHTML = text

        setTimeout(() => {
            document.getElementById("toast_error").classList.toggle("hidden")
        }, duration)
    }
}

function endGame() {
    gamePages.classList.toggle("hidden")
    resultModal.classList.toggle("hidden")
    TweenMax.from(resultModal, .5, {
        x: 20,
        opacity: 0,
        ease: Expo.easeInOut
    })
    document.getElementById("nb_mots_trouves").innerText = `Vous avez trouvé ${nbWordsFound}/${nbWords} mots \n Score: ${score}`
    savePlayerResult()
    score = 0
    step = 1
    nbAttempts = 0
    nbWordsFound = 0
    nbWords = 0
    nbError = 0
    generatedIndex = []
}

function savePlayerResult() {
    const players = getInLocalStorage("players") || []
    const updatedPlayers = []

    players.map(player => {
        if (connectedUser.username == player.username) {
            player.score += score
        }

        updatedPlayers.push(player)
    })

    saveInLocalStorage("players", updatedPlayers)
}

// Chargement des joueurs au niveau du classement
function loadUsers() {
    const players = getInLocalStorage("players") || []

    // Trie des joueurs en fonction du score par ordre décroissant
    const playersSorted = players.sort((a, b) => b.score - a.score);

    rankingPlayers.innerHTML = ""; // Clear existing content

    // Affichage des joueurs
    playersSorted.map(player => {
        const playerItem = document.createElement("div");
        playerItem.classList.add("flex", "items-center", "gap-4", "cursor-pointer", "bg-gray-900", "hover:bg-gray-800", "shadow", "hover:shadow-lg", "py-2", "px-3", "rounded-lg", "transition", "duration-300", "ease-in-out");
        playerItem.classList.add("ranking-item");

        const profile = document.createElement("img");
        profile.setAttribute("src", player.profileUrl);
        profile.setAttribute("alt", "profile");
        profile.classList.add("w-10", "h-10", "p-1", "rounded-full", "ring-2", "ring-gray-300", "dark:ring-gray-500", "cursor-pointer");

        const username = document.createElement("div");
        username.classList.add("username");
        username.innerText = player.username;

        const score = document.createElement("span");
        score.classList.add("text-sm", "text-gray-500", "dark:text-gray-400");
        score.innerText = player.score + " XP";

        if (connectedUser.username == player.username) {
            rankingUserScore = score
        }

        const infos = document.createElement("div");
        infos.classList.add("font-medium", "dark:text-white");
        infos.appendChild(username);
        infos.appendChild(score);

        playerItem.appendChild(profile);
        playerItem.appendChild(infos);

        rankingPlayers.appendChild(playerItem);
    });
}


// Fonction pour rafraichir le classement des joueurs en fonction du score du joueur actuel
function refreshUsersRanking() {
    const players = JSON.parse(localStorage.getItem("players")) || [];

    // Mise à jour du score du joueur connecté
    const updatedPlayers = players.map(player => {
        if (player.username === connectedUser.username) {
            return { ...player, score: player.score + step };
        }
        return player;
    });

    // Sauvegarde de la liste mise à jour dans le localStorage
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    // Trie des joueurs en fonction du score par ordre décroissant
    const playersSorted = updatedPlayers.sort((a, b) => b.score - a.score);

    // Mettre à jour le classement avec des animations
    const rankingItems = Array.from(rankingPlayers.children);

    playersSorted.forEach((player, newIndex) => {
        const playerItem = rankingItems.find(item => item.querySelector('.username').innerText === player.username);
        const oldIndex = rankingItems.indexOf(playerItem);

        if (oldIndex !== newIndex) {
            // Appliquer les classes pour l'animation
            playerItem.classList.add('transition-move');
            const moveBy = (newIndex - oldIndex) * playerItem.offsetHeight;
            playerItem.style.transform = `translateY(${moveBy}px)`;

            // Réinitialiser la transformation après l'animation
            setTimeout(() => {
                playerItem.style.transform = '';
                rankingPlayers.insertBefore(playerItem, rankingPlayers.children[newIndex]);
                playerItem.classList.remove('transition-move');
            }, 500);
        }
    });

    updateUserScore()
}


buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("connectedUser")
    window.location.pathname = env === "prod" ? "/" : "Devinette/"
})

function saveInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getInLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

TweenMax.from("#profile", 1, {
    delay: 0,
    x: 20,
    opacity: 0,
    ease: Expo.easeInOut
})

TweenMax.from("#logout", .5, {
    delay: 0.2,
    x: 20,
    opacity: 0,
    ease: Expo.easeInOut
})

function playAnimation() {
    TweenMax.from(ranking, 1, {
        delay: 0.2,
        x: -20,
        opacity: 0,
        ease: Expo.easeInOut
    })

    TweenMax.from(gameModal, 1, {
        delay: 0.6,
        x: 20,
        opacity: 0,
        ease: Expo.easeInOut
    })

    TweenMax.from("#button_ranking", .5, {
        delay: 0.7,
        x: 20,
        opacity: 0,
        ease: Expo.easeInOut
    })

    TweenMax.from("#button_rules", .5, {
        delay: 0.8,
        x: 20,
        opacity: 0,
        ease: Expo.easeInOut
    })
}
