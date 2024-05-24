const connectedUser = JSON.parse(localStorage.getItem("connectedUser"))
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
const words = ["boire", "marcher", "avion", "telephone", "specialite", "abandonner", "vendre", "partir", "constitution", "ecouter", "entrepreneur", "digital", "digitalisation", "sommaire", "departement", "campus", "universite", "cinema", "chemise", "pantalon", "orange", "banane", "mangue", "avocat", "justice", "serveur", "homme", "fichier", "dossier", "apprendre", "programmation", "rassemblement", "ensemble", "pouvoir", "programme", "folie", "confinement", "maladie", "phase", "compilation", "football", "navigation", "navigateur", "philosophie", "histoire", "ordinateur", "film", "montre", "valeur", "hopital", "joueur", "routeur", "chaise", "climatiseur", "tableau", "ecran"]
let wordToBeGuess, guessedWord, index, score = 0, nbAttempts = 0, nbError = 0, step = 1
let generatedIndex = []

document.addEventListener("DOMContentLoaded", () => {
    // Affichage du nom de la personne connecté sur le header
    document.getElementById("username").innerText = connectedUser.username
    loadUsers()
    displayGameModal()
    buttonGuess.addEventListener("click", validate)
})

buttonRestart.addEventListener("click", displayGameModal)

function displayGameModal() {
    if (gamePages.classList.contains("hidden")) {
        gamePages.classList.toggle("hidden")
        resultModal.classList.toggle("hidden")
        ranking.innerHTML = ""
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
    document.getElementById("guessed_word").value = ""

    if (wordToBeGuess == guessedWord) {
        score += step
        nbError = 0
        nbAttempts++

        if (nbAttempts == 5) {
            step += score == 5 ? 10-step : 10
            nbAttempts = 0
        }
    } else {
        nbAttempts = 0
        nbError++

        if (nbError == 3) {
            score -= Math.floor(score / 5)
            score = score < 0 ? 0 : score
        }

        if (nbError == 5) {
            // Fin du jeu
            endGame()
            return
        }
    }

    spanScore.innerText = "Score: ".concat(score).concat(" XP")
    spanNbTry.innerText = "Tentative: ".concat(nbError).concat("/5")
    nextWord()
    document.getElementById("guessed_word").focus()
}

function endGame() {
    gamePages.classList.toggle("hidden")
    resultModal.classList.toggle("hidden")
    savePlayerResult()
    score = 0
    step = 1
    nbAttempts = 0
    nbError = 0
    generatedIndex = []
}

function savePlayerResult() {
    const players = getInLocalStorage("players")
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
    const players = getInLocalStorage("players")

    // Trie des joueurs en fonction du score par ordre décroissant
    const playersSorted = players.sort((a, b) => {
        return b.score > a.score
    })

    // Affichage des joueurs
    playersSorted.map(player => {
        const playerItem = document.createElement("div")
        playerItem.classList.add("flex", "items-center", "gap-4", "cursor-pointer", "bg-gray-900", "hover:bg-gray-800", "shadow", "hover:shadow-lg", "py-2", "px-3", "rounded-lg", "transition", "duration-300", "ease-in-out")

        const profile = document.createElement("img")
        profile.setAttribute("src", "../images/hello.png")
        profile.setAttribute("alt", "profile")
        profile.classList.add("w-10", "h-10", "p-1", "rounded-full", "ring-2", "ring-gray-300", "dark:ring-gray-500", "cursor-pointer")

        const username = document.createElement("div")
        username.innerText = player.username

        const score = document.createElement("span")
        score.classList.add("text-sm", "text-gray-500", "dark:text-gray-400")
        score.innerText =  player.score + " XP"

        const infos = document.createElement("div")
        infos.classList.add("font-medium", "dark:text-white")
        infos.appendChild(username)
        infos.appendChild(score)

        playerItem.appendChild(profile)
        playerItem.appendChild(infos)

        ranking.appendChild(playerItem)
    })
}

// Fonction pour rafraichir le classement des joueurs en fonction du score du joueur actuel
function refreshUsersRanking() {

}

buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("connectedUser")
    window.location.href = "/Devinette/index.html"
})

function saveInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getInLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}